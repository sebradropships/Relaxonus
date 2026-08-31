/**
 * GraphQL documents for the Storefront API.
 *
 * Field names here were verified against the live 2026-07 endpoint. Notable
 * traps avoided: `productByHandle` is deprecated in favour of
 * `product(handle:)`; `ProductOption.values` is deprecated in favour of
 * `optionValues`; `quantityAvailable` requires the
 * `unauthenticated_read_product_inventory` scope, which this token does not
 * currently have, so it is not requested.
 */

/**
 * What the storefront renders: a badge count, a checkout link, cart totals,
 * and the line items the cart drawer displays.
 *
 * `id` stays — it is what gets written to the cart cookie. `lines(first: 50)`
 * is a real connection charge against Shopify's leaky bucket, but the drawer
 * now genuinely reads every field requested here.
 */
export const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    # applicable is how a rejected code is detected: Shopify accepts the
    # mutation and silently drops an unknown code rather than erroring.
    discountCodes { code applicable }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost {
          totalAmount { amount currencyCode }
          amountPerQuantity { amount currencyCode }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            image { url altText }
            product { title }
          }
        }
      }
    }
  }
`;

/** Live pricing and availability. Curated copy stays in lib/product.ts. */
export const PRODUCT_COMMERCE_QUERY = /* GraphQL */ `
  query ProductCommerce($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      handle
      title
      availableForSale
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          sku
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
    }
  }
`;

/** `cart(id:)` is nullable — expired, completed or tampered ids return null. */
export const CART_QUERY = /* GraphQL */ `
  ${CART_FIELDS}
  query CartQuery($id: ID!, $language: LanguageCode) @inContext(language: $language) {
    cart(id: $id) { ...CartFields }
  }
`;

/**
 * `@inContext(country:)` is ignored on cart operations — country context comes
 * from `buyerIdentity.countryCode` instead.
 */
export const CART_CREATE = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartCreate($input: CartInput!, $language: LanguageCode) @inContext(language: $language) {
    cartCreate(input: $input) {
      cart { ...CartFields }
      userErrors { code field message }
    }
  }
`;

export const CART_LINES_ADD = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { code field message }
    }
  }
`;

/** `id` is the CART LINE id (gid://shopify/CartLine/…), not a variant id. */
export const CART_LINES_UPDATE = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { code field message }
    }
  }
`;

/**
 * Applies discount codes to the cart.
 *
 * Shopify silently drops a code it does not recognise rather than erroring, so
 * the caller has to read `discountCodes[].applicable` back to find out whether
 * it actually landed. Passing an empty array clears every code.
 */
export const CART_DISCOUNT_CODES_UPDATE = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartDiscountCodesUpdate($cartId: ID!, $codes: [String!], $language: LanguageCode)
  @inContext(language: $language) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $codes) {
      cart { ...CartFields }
      userErrors { code field message }
    }
  }
`;

export const CART_LINES_REMOVE = /* GraphQL */ `
  ${CART_FIELDS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode)
  @inContext(language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { code field message }
    }
  }
`;
