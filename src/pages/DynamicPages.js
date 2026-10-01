import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { useShop } from "../context/ShopContext";
import {
  createOrder,
  getContent,
  getOrder,
  getOrders,
  getProducts,
} from "../services/productService";
import "./CommercePages.css";

const Title = ({ children }) => (
  <header className="page-title">
    <p>MAVIINA MANE</p>
    <h1>{children}</h1>
  </header>
);

/* ============================================================
   CHECKOUT
   ============================================================ */

export function DynamicCheckout() {
  const { cart } = useShop();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  async function submit(e) {
    e.preventDefault();

    if (!cart.length) {
      setMessage("Your cart is empty. Add items before placing an order.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = new FormData(e.currentTarget);

      const order = await createOrder({
        customerName: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        address: String(data.get("address") || "").trim(),

        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: Number(item.quantity || 0),
          price: Number(item.price || 0),
        })),
      });

      setMessage(
        `Order ${order?.orderNumber || ""} placed successfully.`
      );
    } catch (error) {
      console.error("Create order error:", error);

      setMessage(
        error?.message ||
          "Unable to place the order. Add items to your cart and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <main className="screen">
        <Title>Checkout</Title>

        <div className="two-column">
          <form className="panel form-grid" onSubmit={submit}>
            <h2>Delivery address</h2>

            <label>
              Name
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
              />
            </label>

            <label className="full">
              Address
              <textarea
                name="address"
                rows="4"
                autoComplete="street-address"
                required
              />
            </label>

            <button
              type="submit"
              className="green-button full"
              disabled={loading || !cart.length}
            >
              {loading ? "Placing order..." : "Place order"}
            </button>

            {message && (
              <p className="form-success full">
                {message}
              </p>
            )}
          </form>

          <aside className="checkout-summary">
            <h2>Order summary</h2>

            {!cart.length && (
              <p>Your cart is empty.</p>
            )}

            {cart.map((item) => (
              <div className="summary-item" key={item.id}>
                <img
                  src={item.image}
                  alt={item.name || "Product"}
                />

                <span>
                  {item.name}
                  <br />
                  <small>
                    {item.quantity} Kg
                  </small>
                </span>

                <b>
                  ₹
                  {Number(item.price || 0) *
                    Number(item.quantity || 0)}
                </b>
              </div>
            ))}

            <div className="summary-total">
              <strong>
                Total
                <em>₹{total}</em>
              </strong>
            </div>
          </aside>
        </div>
      </main>
    </PageLayout>
  );
}

/* ============================================================
   PROFILE
   ============================================================ */

/* ============================================================
   PROFILE / MY ACCOUNT
   ============================================================ */

export function DynamicProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getOrders()
      .then((result) => {
        if (mounted) {
          setOrders(Array.isArray(result) ? result : []);
        }
      })
      .catch((error) => {
        console.error("Get orders error:", error);

        if (mounted) {
          setOrders([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const delivered = orders.filter(
    (order) =>
      String(order.status || "").toUpperCase() === "DELIVERED"
  ).length;

  const pending = orders.filter(
    (order) =>
      String(order.status || "").toUpperCase() !== "DELIVERED"
  ).length;

  const loyaltyPoints = orders.length * 50;

  function getStatus(order) {
    return String(order.status || "PENDING").toUpperCase();
  }

  function isPacked(order) {
    return [
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(getStatus(order));
  }

  function isShipped(order) {
    return [
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(getStatus(order));
  }

  function isOutForDelivery(order) {
    return [
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(getStatus(order));
  }

  function getOrderImage(order) {
    return (
      order?.items?.[0]?.image ||
      order?.items?.[0]?.productImage ||
      ""
    );
  }

  return (
    <PageLayout>
      <main className="profile-page">

        {/* ==================================================
            PROFILE HERO
            ================================================== */}

        <section className="profile-hero">

          <div className="profile-hero-content">

            <p className="profile-eyebrow">
              MY ORCHARD ACCOUNT
            </p>

            <h1>
              Welcome back, dharma.
            </h1>

            <p>
              Your orders, deliveries and seasonal
              favourites in one place.
            </p>

          </div>

          <div className="profile-hero-decoration">
            🌿
          </div>

        </section>


        {/* ==================================================
            ACCOUNT CONTENT
            ================================================== */}

        <section className="profile-container">

          {/* SIDEBAR */}

          <aside className="profile-sidebar">

            <div className="profile-sidebar-title">
              <span>♙</span>
              <strong>My Account</strong>
            </div>

            <nav>

              <Link to="/profile">
                <span>⌂</span>
                Dashboard
              </Link>

              <Link
                to="/orders"
                className="active"
              >
                <span>▣</span>
                My Orders
              </Link>

              <Link to="/track-order">
                <span>⌖</span>
                Track an order
              </Link>

              <Link to="/shop">
                <span>🛒</span>
                Shop mangoes
              </Link>

            </nav>

            <div className="profile-sidebar-divider" />

            <button
              type="button"
              className="profile-signout"
              onClick={() => {
                localStorage.removeItem("customer_session");
                localStorage.removeItem("customer_email");
                window.location.href = "/";
              }}
            >
              <span>⇥</span>
              Sign out
            </button>

          </aside>


          {/* MAIN */}

          <section className="profile-main">

            {/* ==================================================
                METRICS
                ================================================== */}

            <div className="profile-metrics">

              <article className="profile-metric">

                <div className="profile-metric-icon">
                  ▣
                </div>

                <div>
                  <span>Total orders</span>
                  <strong>{orders.length}</strong>
                </div>

              </article>


              <article className="profile-metric">

                <div className="profile-metric-icon">
                  📦
                </div>

                <div>
                  <span>In progress</span>
                  <strong>{pending}</strong>
                </div>

              </article>


              <article className="profile-metric">

                <div className="profile-metric-icon">
                  🚚
                </div>

                <div>
                  <span>Delivered</span>
                  <strong>{delivered}</strong>
                </div>

              </article>


              <article className="profile-metric">

                <div className="profile-metric-icon">
                  ☆
                </div>

                <div>
                  <span>Loyalty points</span>
                  <strong>{loyaltyPoints}</strong>
                </div>

              </article>

            </div>


            {/* ==================================================
                ORDERS
                ================================================== */}

            <section className="profile-orders">

              <div className="profile-orders-header">

                <h2>
                  My orders
                </h2>

                <div className="profile-sort">
                  <span>Sort by</span>
                  <select defaultValue="latest">
                    <option value="latest">
                      Latest first
                    </option>
                    <option value="oldest">
                      Oldest first
                    </option>
                  </select>
                </div>

              </div>


              {loading && (
                <div className="profile-loading">
                  Loading your orders...
                </div>
              )}


              {!loading && !orders.length && (
                <div className="profile-empty">
                  <div>📦</div>
                  <h3>No orders yet</h3>
                  <p>
                    Your farm-fresh orders will appear here.
                  </p>

                  <Link to="/shop">
                    Shop mangoes
                  </Link>
                </div>
              )}


              {!loading &&
                orders.map((order) => {

                  const status = getStatus(order);

                  return (
                    <article
                      className="profile-order-card"
                      key={order.id || order.orderNumber}
                    >

                      {/* PRODUCT IMAGE */}

                      <div className="profile-order-image">

                        {getOrderImage(order) ? (
                          <img
                            src={getOrderImage(order)}
                            alt={
                              order.items?.[0]?.name ||
                              "Farm fresh product"
                            }
                          />
                        ) : (
                          <div className="profile-order-image-placeholder">
                            🥭
                          </div>
                        )}

                      </div>


                      {/* ORDER INFO */}

                      <div className="profile-order-info">

                        <div className="profile-order-heading">

                          <div>

                            <div className="profile-order-number">
                              #{order.orderNumber}
                            </div>

                            <div className="profile-order-date">

                              {order.createdAt
                                ? new Date(
                                    order.createdAt
                                  ).toLocaleDateString()
                                : "-"}

                            </div>

                          </div>

                          <span
                            className={`profile-status status-${status.toLowerCase()}`}
                          >
                            {status.replaceAll("_", " ")}
                          </span>

                        </div>


                        <div className="profile-order-product">

                          {order.items?.[0]?.name ||
                            "Farm fresh product"}

                          <span>
                            ×{" "}
                            {order.items?.[0]?.quantity || 1}
                          </span>

                        </div>


                        {/* ORDER PROGRESS */}

                        <div className="profile-order-progress">

                          <div
                            className="profile-progress-line"
                          />

                          <div
                            className={`profile-progress-step completed`}
                          >
                            <div className="profile-progress-dot">
                              ✓
                            </div>

                            <span>
                              Order placed
                            </span>

                            {order.createdAt && (
                              <small>
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString()}
                              </small>
                            )}
                          </div>


                          <div
                            className={`profile-progress-step ${
                              isPacked(order)
                                ? "completed"
                                : ""
                            }`}
                          >
                            <div className="profile-progress-dot">
                              {isPacked(order) ? "✓" : ""}
                            </div>

                            <span>
                              Packed
                            </span>
                          </div>


                          <div
                            className={`profile-progress-step ${
                              isShipped(order)
                                ? "completed"
                                : ""
                            }`}
                          >
                            <div className="profile-progress-dot">
                              {isShipped(order) ? "✓" : ""}
                            </div>

                            <span>
                              Shipped
                            </span>
                          </div>


                          <div
                            className={`profile-progress-step ${
                              isOutForDelivery(order)
                                ? "completed"
                                : ""
                            }`}
                          >
                            <div className="profile-progress-dot">
                              {isOutForDelivery(order)
                                ? "✓"
                                : ""}
                            </div>

                            <span>
                              Out for delivery
                            </span>
                          </div>

                        </div>

                      </div>


                      {/* PRICE / ACTION */}

                      <div className="profile-order-action">

                        <div className="profile-order-price">
                          ₹{Number(order.total || 0)}
                        </div>

                        <Link
                          to={`/track-order?order=${encodeURIComponent(
                            order.orderNumber || ""
                          )}`}
                          className="profile-track-button"
                        >
                          <span>🚚</span>
                          Track order
                        </Link>

                      </div>

                    </article>
                  );
                })}

            </section>

          </section>

        </section>

      </main>
    </PageLayout>
  );
}

/* ============================================================
   TRACK ORDER
   ============================================================ */

/* ============================================================
   TRACK ORDER
   ============================================================ */

export function DynamicTrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    const value = orderNumber.trim();

    if (!value) {
      setOrder(null);
      setMessage("Please enter your order number.");
      return;
    }

    try {
      setLoading(true);
      setOrder(null);
      setMessage("");

      console.log("Tracking order:", value);

      const result = await getOrder(value);

      setOrder(result);
    } catch (error) {
      console.error("Track order error:", error);

      setOrder(null);
      setMessage(
        error?.message ||
          "Order not found. Check the order number and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const status = String(
    order?.status || "PENDING"
  ).toUpperCase();

  const packedComplete = [
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].includes(status);

  const shippedComplete = [
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].includes(status);

  const outForDeliveryComplete = [
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ].includes(status);

  const deliveredComplete = status === "DELIVERED";

  return (
    <PageLayout>
      <main className="track-page">

        {/* HERO */}
        <section className="track-hero">

          <div className="track-hero-content">

            <p className="track-eyebrow">
              MAVIINA MANE
            </p>

            <h1>
              Track your order
            </h1>

            <p className="track-subtitle">
              Follow your farm-fresh goodies from our farm
              to your doorstep.
            </p>

            {/* FEATURE ITEMS */}
            <div className="track-features">

              <div className="track-feature">
                <div className="track-feature-icon">
                  🌿
                </div>

                <div>
                  <strong>Freshly Packed</strong>
                  <span>With care</span>
                </div>
              </div>

              <div className="track-feature">
                <div className="track-feature-icon">
                  🚚
                </div>

                <div>
                  <strong>Safe Delivery</strong>
                  <span>To your location</span>
                </div>
              </div>

              <div className="track-feature">
                <div className="track-feature-icon">
                  ♡
                </div>

                <div>
                  <strong>100% Natural</strong>
                  <span>From our farm</span>
                </div>
              </div>

            </div>

          </div>

          <div className="track-hero-image">
            {order?.items?.[0]?.image && (
              <img
                src={order.items[0].image}
                alt="Farm fresh products"
              />
            )}
          </div>

        </section>


        {/* SEARCH CARD */}
        <section className="track-search-card">

          <div className="track-search-icon">
            📦
          </div>

          <form onSubmit={submit}>

            <label>
              Order number

              <div className="track-search-row">

                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value);
                    setMessage("");
                  }}
                  placeholder="ORD123456"
                  autoComplete="off"
                  spellCheck="false"
                  required
                />

                <button
                  type="submit"
                  className="track-search-button"
                  disabled={loading}
                >
                  <span>⌕</span>

                  {loading
                    ? "Tracking..."
                    : "Track order"}
                </button>

              </div>

              <small>
                Enter your order number to see the latest status.
              </small>
            </label>

          </form>

        </section>


        {/* ERROR */}
        {message && (
          <div className="track-message">
            {message}
          </div>
        )}


        {/* ORDER RESULT */}
        {order && (
          <section className="track-result-card">

            {/* ORDER HEADER */}
            <div className="track-result-header">

              <div className="track-order-main">

                <div className="track-package-icon">
                  📦
                </div>

                <div>

                  <small>
                    ORDER NUMBER
                  </small>

                  <div className="track-order-number">
                    {order.orderNumber}
                  </div>

                  <p>
                    Fresh from our farm
                    <span>•</span>
                    On its way to you
                  </p>

                </div>

                <span className={`track-status status-${status.toLowerCase()}`}>
                  {status.replaceAll("_", " ")}
                </span>

              </div>


              {/* DELIVERY */}
              <div className="track-delivery-info">

                <div className="track-location-icon">
                  ⌖
                </div>

                <div>

                  <small>
                    Estimated delivery
                  </small>

                  <strong>
                    {order.estimatedDeliveryDays
                      ? `${order.estimatedDeliveryDays} days`
                      : "Arriving soon"}{" "}
                    🌿
                  </strong>

                  <span>
                    We'll notify you once it's out for delivery.
                  </span>

                </div>

              </div>

            </div>


            {/* TIMELINE */}
            <div className="track-timeline">

              {/* ORDER PLACED */}
              <div className="track-step completed">

                <div className="track-step-line">

                  <div className="track-step-dot">
                    ✓
                  </div>

                </div>

                <div className="track-step-content">

                  <strong>
                    Order placed
                  </strong>

                  {order.createdAt && (
                    <span>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </span>
                  )}

                </div>

              </div>


              {/* PACKED */}
              <div
                className={`track-step ${
                  packedComplete ? "completed" : "pending"
                }`}
              >

                <div className="track-step-line">

                  <div className="track-step-dot">
                    {packedComplete ? "✓" : ""}
                  </div>

                </div>

                <div className="track-step-content">

                  <strong>
                    Packed with care
                  </strong>

                  <span>
                    Your order is being carefully
                    packed with farm-fresh products.
                  </span>

                </div>

              </div>


              {/* SHIPPED */}
              <div
                className={`track-step ${
                  shippedComplete ? "completed" : "pending"
                }`}
              >

                <div className="track-step-line">

                  <div className="track-step-dot">
                    {shippedComplete ? "✓" : ""}
                  </div>

                </div>

                <div className="track-step-content">

                  <strong>
                    Shipped from our farm
                  </strong>

                  <span>
                    On the way to your location.
                  </span>

                </div>

              </div>


              {/* OUT FOR DELIVERY */}
              <div
                className={`track-step ${
                  outForDeliveryComplete
                    ? "completed"
                    : "pending"
                }`}
              >

                <div className="track-step-line">

                  <div className="track-step-dot">
                    {outForDeliveryComplete ? "✓" : ""}
                  </div>

                </div>

                <div className="track-step-content">

                  <strong>
                    Out for delivery
                  </strong>

                  <span>
                    Arriving at your doorstep soon.
                  </span>

                </div>

              </div>

            </div>


            {/* ORDER DETAILS */}
            <div className="track-details">

              <div>

                <div className="track-detail-icon">
                  🚚
                </div>

                <div>
                  <span>Tracking number</span>

                  <strong>
                    {order.trackingNumber ||
                      order.orderNumber}
                  </strong>
                </div>

              </div>


              <div>

                <div className="track-detail-icon">
                  🌿
                </div>

                <div>
                  <span>Order type</span>

                  <strong>
                    Fresh produce
                  </strong>
                </div>

              </div>


              <div>

                <div className="track-detail-icon">
                  📦
                </div>

                <div>
                  <span>Items</span>

                  <strong>
                    {order.items?.length || 0} farm fresh items
                  </strong>
                </div>

              </div>

            </div>


            {/* OPTIONAL COURIER */}
            {order.courier && (
              <div className="track-courier">
                <span>Courier</span>
                <strong>{order.courier}</strong>
              </div>
            )}

          </section>
        )}


        {/* BOTTOM TRUST BANNER */}
        <section className="track-trust-banner">

          <div className="track-trust-title">

            <div className="track-trust-leaf">
              🌿
            </div>

            <div>
              <h3>
                Farm fresh. Delivered with care.
              </h3>

              <p>
                From our fields to your family,
                we ensure every order reaches you
                fresh and on time.
              </p>
            </div>

          </div>


          <div className="track-trust-items">

            <div>
              <span>🌿</span>
              <div>
                <strong>Quality checked</strong>
                <small>Fresh & natural</small>
              </div>
            </div>

            <div>
              <span>🛡️</span>
              <div>
                <strong>Safe packaging</strong>
                <small>Handled with care</small>
              </div>
            </div>

            <div>
              <span>🚚</span>
              <div>
                <strong>Reliable delivery</strong>
                <small>To your doorstep</small>
              </div>
            </div>

          </div>

        </section>

      </main>
    </PageLayout>
  );
}

/* ============================================================
   ABOUT / FARM
   ============================================================ */

export function DynamicAbout() {
  const [farm, setFarm] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getContent("farm")
      .then((item) => {
        setFarm(item?.value || {});
      })
      .catch((error) => {
        console.error(
          "Get farm content error:",
          error
        );

        setFarm({});
      });

    getProducts()
      .then((result) => {
        setProducts(
          Array.isArray(result)
            ? result
            : []
        );
      })
      .catch((error) => {
        console.error(
          "Get products error:",
          error
        );

        setProducts([]);
      });
  }, []);

  const data = farm || {};

  return (
    <PageLayout>
      <main className="screen">
        <section className="farm-hero">
          <div>
            <p>
              {data.eyebrow ||
                "FROM OUR FARM"}
            </p>

            <h1>
              {data.title ||
                "Farm details coming soon"}
            </h1>

            <span>
              {data.description ||
                "The store administrator can add farm information from Admin → Settings."}
            </span>
          </div>

          {products[0]?.image && (
            <img
              src={products[0].image}
              alt="Farm harvest"
            />
          )}
        </section>

        <div className="farm-stats">
          {[
            [
              data.happyCustomers,
              "Happy Customers",
            ],
            [
              data.acres,
              "Acres of Farms",
            ],
            [
              data.ordersDelivered,
              "Orders Delivered",
            ],
            [
              data.yearsOfCare,
              "Years Of Care",
            ],
          ].map(([number, label]) => (
            <div key={label}>
              <b>
                {number || 0}+
              </b>

              <span>
                {label}
              </span>
            </div>
          ))}
        </div>

        <h2 className="section-heading">
          Our Farm Gallery
        </h2>

        <div className="gallery-row">
          {products
            .slice(0, 5)
            .filter(
              (product) => product.image
            )
            .map((product) => (
              <img
                key={product.id}
                src={product.image}
                alt={
                  product.name ||
                  "Farm product"
                }
              />
            ))}
        </div>
      </main>
    </PageLayout>
  );
}