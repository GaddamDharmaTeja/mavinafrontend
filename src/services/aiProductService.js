const PRODUCT_API_URL = "http://localhost:8080/api/products";

export const getProductsForAI = async () => {
  try {
    const response = await fetch(PRODUCT_API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    return products;
  } catch (error) {
    console.error("AI product API error:", error);

    return [];
  }
};