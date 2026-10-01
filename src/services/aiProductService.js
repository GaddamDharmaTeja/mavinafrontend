import { getProducts } from "./productService";

export const getProductsForAI = async () => {
  try {
    // Keep the optional assistant on the same API origin, auth handling, and
    // response normalization as the rest of the storefront. Product data is
    // enrichment for AI only, so a sleeping/unavailable API must not break the
    // page or trigger a browser console error overlay.
    return await getProducts();
  } catch {
    return [];
  }
};
