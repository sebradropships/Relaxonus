import "server-only";

import { cookies } from "next/headers";

import { KEY_BY_OPTION_VALUE, CART_COOKIE, CART_COOKIE_MAX_AGE, COUNTRY, LANGUAGE } from "@/lib/shopify/config";
import { storefrontLive } from "@/lib/shopify/client";
import { CART_CREATE, CART_LINES_ADD, CART_QUERY } from "@/lib/shopify/queries";
import type { CartLineView, CartSummary, Money } from "@/lib/shopify/types";

interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      merchandise: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: { name: string; value: string }[];
        price: Money;
        product: { title: string; handle: string };
      };
    }[];
  };
}

interface UserError {
  code?: string | null;
  field?: string[] | null;
  message: string;
}

/* --------------------------------- cookie --------------------------------- */

/**
 * The cart id lives in an httpOnly cookie.
 *
 * Anyone holding a cart id can read and modify that cart, so it is kept out of
 * reach of client JavaScript rather than in localStorage. The stored value is
 * the complete id including its `?key=` query string — truncating it breaks
 * every subsequent request.
 */
async function readCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

async function writeCartId(id: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

async function clearCartId(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}

/* --------------------------------- mapping -------------------------------- */

function toSummary(cart: RawCart): CartSummary {
  const lines: CartLineView[] = cart.lines.nodes.map((node) => {
    const colour = node.merchandise.selectedOptions.find(
      (option) => option.name.trim().toLowerCase() === "color",
    );

    return {
      id: node.id,
      quantity: node.quantity,
      title: node.merchandise.product.title,
      variantTitle: node.merchandise.title,
      merchandiseId: node.merchandise.id,
      key: colour ? (KEY_BY_OPTION_VALUE[colour.value.trim().toLowerCase()] ?? null) : null,
      unitPrice: node.merchandise.price,
      lineTotal: node.cost.totalAmount,
      availableForSale: node.merchandise.availableForSale,
    };
  });

  return {
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    total: cart.cost.totalAmount,
    checkoutUrl: cart.checkoutUrl,
    lines,
  };
}

function firstError(errors: UserError[] | undefined): string | null {
  if (!errors || errors.length === 0) return null;
  return errors[0].message || "Shopify rejected the cart operation.";
}

/* --------------------------------- reads ---------------------------------- */

/** Current cart, or null when there is no cart or the stored id has expired. */
export async function getCart(): Promise<CartSummary | null> {
  const id = await readCartId();
  if (!id) return null;

  try {
    const data = await storefrontLive<{ cart: RawCart | null }>(CART_QUERY, {
      id,
      language: LANGUAGE,
    });

    // Shopify returns null for carts that were completed, expired or tampered
    // with. Drop the stale cookie so the next add starts a fresh cart.
    if (!data.cart) {
      await clearCartId();
      return null;
    }

    return toSummary(data.cart);
  } catch {
    return null;
  }
}

/* -------------------------------- mutations ------------------------------- */

export interface AddResult {
  ok: boolean;
  cart: CartSummary | null;
  error?: string;
}

/**
 * Adds one unit of a variant, creating the cart on first use.
 *
 * If the stored cart has expired, this falls back to creating a new one rather
 * than surfacing an error the shopper cannot act on.
 */
export async function addLine(merchandiseId: string, quantity = 1): Promise<AddResult> {
  const existingId = await readCartId();

  if (existingId) {
    try {
      const data = await storefrontLive<{
        cartLinesAdd: { cart: RawCart | null; userErrors: UserError[] };
      }>(CART_LINES_ADD, {
        cartId: existingId,
        lines: [{ merchandiseId, quantity }],
        language: LANGUAGE,
      });

      const error = firstError(data.cartLinesAdd.userErrors);
      const cart = data.cartLinesAdd.cart;

      if (!error && cart) {
        return { ok: true, cart: toSummary(cart) };
      }

      // Stale cart id: start over instead of failing the click.
      await clearCartId();
    } catch {
      await clearCartId();
    }
  }

  try {
    const data = await storefrontLive<{
      cartCreate: { cart: RawCart | null; userErrors: UserError[] };
    }>(CART_CREATE, {
      input: {
        lines: [{ merchandiseId, quantity }],
        buyerIdentity: { countryCode: COUNTRY },
      },
      language: LANGUAGE,
    });

    const error = firstError(data.cartCreate.userErrors);
    const cart = data.cartCreate.cart;

    if (error || !cart) {
      return { ok: false, cart: null, error: error ?? "Could not create a cart." };
    }

    await writeCartId(cart.id);
    return { ok: true, cart: toSummary(cart) };
  } catch {
    return { ok: false, cart: null, error: "Could not reach the store. Please try again." };
  }
}
