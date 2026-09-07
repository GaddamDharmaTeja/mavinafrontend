const runtimeOrigin = typeof window !== "undefined" && !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname)
  ? "https://mavinabackend-1.onrender.com"
  : "http://localhost:8080";
const api = (process.env.NEXT_PUBLIC_API_BASE_URL || `${runtimeOrigin}/api`).replace(/\/$/, "");


const PRODUCT_API_URL = `${api}/products`;

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