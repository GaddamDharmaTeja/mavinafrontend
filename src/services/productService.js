const api = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api").replace(/\/$/, "");
const asArray = value => Array.isArray(value) ? value : Array.isArray(value?.data) ? value.data : [];
const storedToken = () => {
  if (typeof window === "undefined") return "";
  const adminToken = window.localStorage.getItem("admin_token");
  if (adminToken) return adminToken;
  try { return JSON.parse(window.localStorage.getItem("customer") || "{}").token || ""; } catch { return ""; }
};
export const assetUrl = value => {
  if (!value || /^https?:\/\//i.test(value) || value.startsWith("data:")) return value || "";
  const origin = (process.env.NEXT_PUBLIC_API_ORIGIN || "").replace(/\/$/, "");
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};
const normalizeProduct = product => ({ ...product, id: product.id || product._id, image: assetUrl(product.imageUrl || product.image || ""), weight: product.weight || "" });
async function readResponse(response) {
  const type = response.headers.get("content-type") || "";
  const raw = type.includes("application/json") ? null : await response.text();
  const data = type.includes("application/json") ? await response.json() : { error: type.includes("text/html") ? "The API server is unavailable. Start the app with npm run dev, not next dev." : raw };
  if (!response.ok) throw new Error(data.error || "Request failed. Please try again.");
  return data;
}
async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const token = storedToken();
    const response = await fetch(`${api}${path}`, { credentials: "include", signal: controller.signal, ...options, headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
    return readResponse(response);
  } catch (error) {
    if (error.name === "AbortError") throw new Error("The server took too long to respond. Please try again.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
const adminHeaders = () => ({ "Content-Type": "application/json", ...(storedToken() ? { Authorization: `Bearer ${storedToken()}` } : {}) });
async function adminRequest(path, options = {}) {
  const response = await fetch(`${api}/admin${path}`, { credentials: "include", ...options, headers: { ...adminHeaders(), ...(options.headers || {}) } });
  return response.status === 204 ? null : readResponse(response);
}

export const getProducts = async () => asArray(await request("/products")).map(normalizeProduct);
export const getProduct = async id => normalizeProduct(await request(`/products/${id}`));
export const getCategories = async () => asArray(await request("/categories"));
export const getOrders = async () => asArray(await request("/orders"));
export const getMyOrders = async () => asArray(await request("/orders/mine"));
export const getOrder = number => request(`/orders/${number}`);
export const createOrder = order => request("/orders", { method: "POST", body: JSON.stringify(order) });
export const completePayment = (number, method) => request(`/orders/${number}/payment`, { method: "POST", body: JSON.stringify({ method }) });
export const getContent = key => request(`/content/${key}`);
export const getFarms = async () => asArray(await request("/farms"));
export const submitSellerApplication = data => request("/seller-applications", { method: "POST", body: JSON.stringify(data) });
export const submitContactMessage = data => request("/contact-messages", { method: "POST", body: JSON.stringify(data) });
export const getDeliveryQuote = (pincode, subtotal) => request(`/delivery-zones/quote?pincode=${encodeURIComponent(pincode)}&subtotal=${subtotal}`);
export const getMapsConfig = () => request("/maps/config");
export const getNotifications = email => request(`/notifications?email=${encodeURIComponent(email)}`);
export const markNotificationRead = id => request(`/notifications/${id}/read`, { method: "PATCH" });
export const registerUser = async user => request("/users/register", { method: "POST", body: JSON.stringify(user) });
export const loginUser = async (email, password) => request("/users/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const logout = async () => { const result = await request("/auth/logout", { method: "POST" }); if (typeof window !== "undefined") { window.localStorage.removeItem("customer"); window.localStorage.removeItem("admin_token"); } return result; };
export const getRazorpayConfig = () => request("/payment/config");
export const createRazorpayOrder = (amount, orderNumber) => request("/payment/create-order", { method: "POST", body: JSON.stringify({ amount, orderNumber }) });
export const verifyPayment = data => request("/payment/verify", { method: "POST", body: JSON.stringify(data) });
export const adminLogin = async (email, password) => { const result = await request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }); if (typeof window !== "undefined" && result.token) window.localStorage.setItem("admin_token", result.token); return result; };
export const registerAdmin = data => request("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const getAdminDashboard = () => adminRequest("/dashboard");
export const getAdminProducts = () => adminRequest("/products");
export const saveAdminProduct = product => adminRequest(`/products${product.id ? `/${product.id}` : ""}`, { method: product.id ? "PUT" : "POST", body: JSON.stringify(product) });
export const getAdminAnalytics = () => adminRequest("/analytics");
export const getAdminCustomers = () => adminRequest("/customers");
export const getAdminContactMessages = () => adminRequest("/contact-messages");
export const updateAdminContactMessage = (id, status) => adminRequest(`/contact-messages/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
export const getAdminFarms = () => adminRequest("/farms");
export const saveAdminFarm = farm => adminRequest(`/farms${farm.id ? `/${farm.id}` : ""}`, { method: farm.id ? "PUT" : "POST", body: JSON.stringify(farm) });
export const getSellerApplications = () => adminRequest("/seller-applications");
export const reviewSellerApplication = (id, data) => adminRequest(`/seller-applications/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const getDeliveryZones = () => adminRequest("/delivery-zones");
export const saveDeliveryZone = zone => adminRequest(`/delivery-zones${zone.id ? `/${zone.id}` : ""}`, { method: zone.id ? "PUT" : "POST", body: JSON.stringify(zone) });
export const getAdminCategories = () => adminRequest("/categories");
export const saveAdminCategory = category => adminRequest(`/categories${category.id ? `/${category.id}` : ""}`, { method: category.id ? "PUT" : "POST", body: JSON.stringify(category) });
export const getAdminOrders = q => adminRequest(`/orders${q ? `?q=${encodeURIComponent(q)}` : ""}`);
export const updateAdminOrder = (id, data) => adminRequest(`/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const getAdminContent = key => adminRequest(`/content/${key}`);
export const saveAdminContent = (key, value) => adminRequest(`/content/${key}`, { method: "PUT", body: JSON.stringify({ key, value }) });
export const archiveAdminRecord = (collection, id) => adminRequest(`/${collection}/${id}/archive`, { method: "POST" });
export const restoreAdminRecord = (collection, id) => adminRequest(`/${collection}/${id}/restore`, { method: "POST" });
export const purgeAdminRecord = (collection, id) => adminRequest(`/${collection}/${id}`, { method: "DELETE" });
export const archiveAdminProduct = id => archiveAdminRecord("products", id);
export async function uploadAdminImage(file) { const body = new FormData(); body.append("file", file); return request("/uploads", { method: "POST", body }); }
