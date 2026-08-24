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

export const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
            product { title handle }
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
