const runtimeOrigin =
  typeof window !== "undefined" &&
  !/^localhost$|^127\.0\.0\.1$/.test(window.location.hostname)
    ? "https://mavinabackend-1.onrender.com"
    : "http://localhost:8080";

const api = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  `${runtimeOrigin}/api`
).replace(/\/$/, "");

// ============================================================
// HELPERS
// ============================================================

const asArray = (value) =>
  Array.isArray(value)
    ? value
    : Array.isArray(value?.data)
      ? value.data
      : [];

const storedToken = () => {
  if (typeof window === "undefined") return "";

  const adminToken =
    window.localStorage.getItem("admin_token");

  if (adminToken) return adminToken;

  try {
    return (
      JSON.parse(
        window.localStorage.getItem("customer") || "{}"
      ).token || ""
    );
  } catch {
    return "";
  }
};

export const assetUrl = (value) => {
  if (
    !value ||
    /^https?:\/\//i.test(value) ||
    value.startsWith("data:")
  ) {
    return value || "";
  }

  const configuredOrigin =
    process.env.NEXT_PUBLIC_API_ORIGIN ||
    api.replace(/\/api\/?$/, "");

  const origin = configuredOrigin
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
};

const normalizeProduct = (product) => ({
  ...product,
  id: product.id || product._id,
  image: assetUrl(
    product.imageUrl ||
      product.image ||
      ""
  ),
  weight: product.weight || "",
});

// ============================================================
// RESPONSE HANDLER
// ============================================================

async function readResponse(response) {
  const type =
    response.headers.get("content-type") || "";

  const raw =
    type.includes("application/json")
      ? null
      : await response.text();

  const data =
    type.includes("application/json")
      ? await response.json()
      : {
          error: type.includes("text/html")
            ? "The API server is unavailable. Start the app with npm run dev, not next dev."
            : raw,
        };

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

// ============================================================
// PUBLIC REQUEST
// ============================================================

async function request(path, options = {}) {
  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    15_000
  );

  try {
    const token = storedToken();

    const response = await fetch(
      `${api}${path}`,
      {
        credentials: "include",
        signal: controller.signal,
        ...options,

        headers: {
          ...(options.body instanceof FormData
            ? {}
            : {
                "Content-Type":
                  "application/json",
              }),

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...(options.headers || {}),
        },
      }
    );

    return readResponse(response);

  } catch (error) {

    if (error.name === "AbortError") {
      throw new Error(
        "The server took too long to respond. Please try again."
      );
    }

    throw error;

  } finally {
    clearTimeout(timeout);
  }
}

// ============================================================
// ADMIN REQUEST
// ============================================================

const adminHeaders = () => ({
  "Content-Type": "application/json",

  ...(storedToken()
    ? {
        Authorization:
          `Bearer ${storedToken()}`,
      }
    : {}),
});

async function adminRequest(
  path,
  options = {}
) {
  const response = await fetch(
    `${api}/admin${path}`,
    {
      credentials: "include",
      ...options,

      headers: {
        ...adminHeaders(),
        ...(options.headers || {}),
      },
    }
  );

  return response.status === 204
    ? null
    : readResponse(response);
}

// ============================================================
// PUBLIC APIs
// ============================================================

export const getProducts = async () =>
  asArray(
    await request("/products")
  ).map(normalizeProduct);

export const getProduct = async (id) =>
  normalizeProduct(
    await request(`/products/${id}`)
  );

export const getCategories = async () =>
  asArray(
    await request("/categories")
  );

export const getOrders = async () =>
  asArray(
    await request("/orders")
  );

export const getMyOrders = async () =>
  asArray(
    await request("/orders/mine")
  );
export const getOrder = (number) => {
  const orderNumber = String(number || "").trim();

  if (!orderNumber) {
    throw new Error("Please enter your order number.");
  }

  return request(
    `/orders/${encodeURIComponent(orderNumber)}`
  );
};

export const createOrder = (order) =>
  request("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });

export const completePayment = (
  number,
  method
) =>
  request(
    `/orders/${number}/payment`,
    {
      method: "POST",
      body: JSON.stringify({
        method,
      }),
    }
  );

export const getContent = (key) =>
  request(`/content/${key}`);

export const getFarms = async () =>
  asArray(
    await request("/farms")
  );

export const submitSellerApplication = (
  data
) =>
  request("/seller-applications", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const submitContactMessage = (
  data
) =>
  request("/contact-messages", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getDeliveryQuote = (
  pincode,
  subtotal
) =>
  request(
    `/delivery-zones/quote?pincode=${encodeURIComponent(
      pincode
    )}&subtotal=${subtotal}`
  );

export const calculateDeliveryCharges = (
  distanceKm,
  weightKg
) =>
  request(
    "/delivery-charges/calculate",
    {
      method: "POST",
      body: JSON.stringify({
        distanceKm,
        weightKg,
      }),
    }
  );

export const getMapsConfig = () =>
  request("/maps/config");

export const getNotifications = (
  email
) =>
  request(
    `/notifications?email=${encodeURIComponent(
      email
    )}`
  );

export const markNotificationRead = (
  id
) =>
  request(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
    }
  );

// ============================================================
// AUTH
// ============================================================

export const registerUser = async (
  user
) =>
  request("/users/register", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const loginUser = async (
  email,
  password
) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

export const logout = async () => {

  const result = await request(
    "/auth/logout",
    {
      method: "POST",
    }
  );

  if (typeof window !== "undefined") {

    window.localStorage.removeItem(
      "customer"
    );

    window.localStorage.removeItem(
      "admin_token"
    );
  }

  return result;
};

export const adminLogin = async (
  email,
  password
) => {

  const result = await request(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (
    typeof window !== "undefined" &&
    result?.token
  ) {
    window.localStorage.setItem(
      "admin_token",
      result.token
    );
  }

  return result;
};

export const registerAdmin = (
  data
) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ============================================================
// PAYMENT
// ============================================================

export const getRazorpayConfig = () =>
  request("/payment/config");

export const createRazorpayOrder = (
  amount,
  orderNumber
) =>
  request(
    "/payment/create-order",
    {
      method: "POST",
      body: JSON.stringify({
        amount,
        orderNumber,
      }),
    }
  );

export const verifyPayment = (
  data
) =>
  request(
    "/payment/verify",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

// ============================================================
// ADMIN - DASHBOARD
// ============================================================

export const getAdminDashboard = () =>
  adminRequest("/dashboard");

export const getAdminAnalytics = () =>
  adminRequest("/analytics");

export const getAdminCustomers = () =>
  adminRequest("/customers");

// ============================================================
// ADMIN - PRODUCTS
// ============================================================

export const getAdminProducts = () =>
  adminRequest("/products");

export const saveAdminProduct = (
  product
) =>
  adminRequest(
    `/products${
      product.id
        ? `/${product.id}`
        : ""
    }`,
    {
      method: product.id
        ? "PUT"
        : "POST",

      body: JSON.stringify(product),
    }
  );

// ============================================================
// ADMIN - CATEGORIES
// ============================================================

export const getAdminCategories = () =>
  adminRequest("/categories");

export const saveAdminCategory = (
  category
) =>
  adminRequest(
    `/categories${
      category.id
        ? `/${category.id}`
        : ""
    }`,
    {
      method: category.id
        ? "PUT"
        : "POST",

      body: JSON.stringify(category),
    }
  );

// ============================================================
// ADMIN - ORDERS
// ============================================================

export const getAdminOrders = (q) =>
  adminRequest(
    `/orders${
      q
        ? `?q=${encodeURIComponent(q)}`
        : ""
    }`
  );

export const updateAdminOrder = (
  id,
  data
) =>
  adminRequest(
    `/orders/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

// ============================================================
// ADMIN - CONTACT MESSAGES
// ============================================================

export const getAdminContactMessages =
  () =>
    adminRequest(
      "/contact-messages"
    );

export const updateAdminContactMessage = (
  id,
  status
) =>
  adminRequest(
    `/contact-messages/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );

// ============================================================
// ADMIN - FARMS
// ============================================================

export const getAdminFarms = () =>
  adminRequest("/farms");

export const saveAdminFarm = (
  farm
) =>
  adminRequest(
    `/farms${
      farm.id
        ? `/${farm.id}`
        : ""
    }`,
    {
      method: farm.id
        ? "PUT"
        : "POST",

      body: JSON.stringify(farm),
    }
  );

// ============================================================
// ADMIN - SELLER APPLICATIONS
// ============================================================

export const getSellerApplications =
  () =>
    adminRequest(
      "/seller-applications"
    );

export const reviewSellerApplication = (
  id,
  data
) =>
  adminRequest(
    `/seller-applications/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );

// ============================================================
// ADMIN - DELIVERY ZONES
// ============================================================

export const getDeliveryZones = () =>
  adminRequest(
    "/delivery-zones"
  );

export const saveDeliveryZone = (
  zone
) =>
  adminRequest(
    `/delivery-zones${
      zone.id
        ? `/${zone.id}`
        : ""
    }`,
    {
      method: zone.id
        ? "PUT"
        : "POST",

      body: JSON.stringify(zone),
    }
  );

// ============================================================
// ADMIN - DELIVERY CHARGES
// ============================================================

export const getDeliveryCharges = () =>
  adminRequest(
    "/delivery-charges"
  );

export const saveDeliveryCharge = (
  slab
) =>
  adminRequest(
    `/delivery-charges${
      slab.id
        ? `/${slab.id}`
        : ""
    }`,
    {
      method: slab.id
        ? "PUT"
        : "POST",

      body: JSON.stringify(slab),
    }
  );

export const deleteDeliveryCharge = (
  id
) =>
  adminRequest(
    `/delivery-charges/${id}`,
    {
      method: "DELETE",
    }
  );

// ============================================================
// ADMIN - CONTENT
// ============================================================

export const getAdminContent = (
  key
) =>
  adminRequest(
    `/content/${key}`
  );

export const saveAdminContent = (
  key,
  value
) =>
  adminRequest(
    `/content/${key}`,
    {
      method: "PUT",
      body: JSON.stringify({
        key,
        value,
      }),
    }
  );

// ============================================================
// ADMIN - ARCHIVE
// ============================================================

/*
 * Archive a record.
 *
 * Products:
 * DELETE /api/admin/products/{id}/archive
 *
 * Categories:
 * DELETE /api/admin/categories/{id}/archive
 *
 * Orders:
 * DELETE /api/admin/orders/{id}/archive
 */
export const archiveAdminRecord = (
  collection,
  id
) => {

  if (!collection || !id) {
    throw new Error(
      "Collection and ID are required for archive."
    );
  }

  const supportedCollections = [
    "products",
    "categories",
    "orders",
  ];

  if (
    !supportedCollections.includes(
      collection
    )
  ) {
    throw new Error(
      `Archive is not configured for "${collection}".`
    );
  }

  return adminRequest(
    `/${collection}/${id}/archive`,
    {
      method: "DELETE",
    }
  );
};

// ============================================================
// ADMIN - RESTORE
// ============================================================

/*
 * Restore a record.
 *
 * Products:
 * POST /api/admin/products/{id}/restore
 *
 * Categories:
 * POST /api/admin/categories/{id}/restore
 *
 * Orders:
 * POST /api/admin/orders/{id}/restore
 */
export const restoreAdminRecord = (
  collection,
  id
) => {

  if (!collection || !id) {
    throw new Error(
      "Collection and ID are required for restore."
    );
  }

  const supportedCollections = [
    "products",
    "categories",
    "orders",
  ];

  if (
    !supportedCollections.includes(
      collection
    )
  ) {
    throw new Error(
      `Restore is not configured for "${collection}".`
    );
  }

  return adminRequest(
    `/${collection}/${id}/restore`,
    {
      method: "POST",
    }
  );
};

// ============================================================
// ADMIN - PERMANENT DELETE
// ============================================================

/*
 * Permanent delete.
 *
 * Products:
 * DELETE /api/admin/products/{id}/permanent
 *
 * Categories:
 * DELETE /api/admin/categories/{id}/permanent
 *
 * Orders:
 * DELETE /api/admin/orders/{id}
 */
export const purgeAdminRecord = (
  collection,
  id
) => {

  if (!collection || !id) {
    throw new Error(
      "Collection and ID are required for permanent delete."
    );
  }

  if (
    collection === "products" ||
    collection === "categories"
  ) {
    return adminRequest(
      `/${collection}/${id}/permanent`,
      {
        method: "DELETE",
      }
    );
  }

  if (collection === "orders") {
    return adminRequest(
      `/orders/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  throw new Error(
    `Permanent delete is not configured for "${collection}".`
  );
};

// ============================================================
// PRODUCT ARCHIVE SHORTCUT
// ============================================================

export const archiveAdminProduct = (
  id
) =>
  archiveAdminRecord(
    "products",
    id
  );

// ============================================================
// IMAGE UPLOAD
// ============================================================

export async function uploadAdminImage(
  file,
  entityType = "GENERAL",
  entityId
) {

  const body = new FormData();

  body.append(
    "file",
    file
  );

  body.append(
    "entityType",
    entityType
  );

  if (entityId) {
    body.append(
      "entityId",
      entityId
    );
  }

  return request(
    "/uploads",
    {
      method: "POST",
      body,
    }
  );
}