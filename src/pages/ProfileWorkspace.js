import { useEffect, useState } from "react";
import {
  FiLogOut,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiStar,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { getMyOrders } from "../services/productService";
import "../pages/CommercePages.css";
import "../styles.css";

export default function ProfileWorkspace() {
  const navigate = useNavigate();

  const customer = JSON.parse(
    localStorage.getItem("customer") || "null"
  );

  const [view, setView] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Which order is currently expanded
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!customer) {
      setLoading(false);
      return;
    }

    getMyOrders()
      .then((result) => {
        setOrders(Array.isArray(result) ? result : []);
      })
      .catch((error) => {
        console.error("Get my orders error:", error);
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!customer) {
    return (
      <PageLayout>
        <main className="profile-page">
          <section className="profile-empty-page">
            <div className="profile-empty-icon">
              <FiPackage />
            </div>

            <h1>Your account</h1>

            <p>
              Sign in to see your orders and delivery updates.
            </p>

            <button
              className="profile-primary-button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </section>
        </main>
      </PageLayout>
    );
  }

  const delivered = orders.filter(
    (order) =>
      String(order.status || "").toUpperCase() === "DELIVERED"
  ).length;

  const inProgress = orders.filter(
    (order) =>
      !["DELIVERED", "CANCELLED"].includes(
        String(order.status || "").toUpperCase()
      )
  ).length;

  const orchardPoints = delivered * 50;

  function logout() {
    localStorage.removeItem("customer");

    window.dispatchEvent(
      new Event("customer-auth-changed")
    );

    navigate("/login", { replace: true });
  }

  function status(order) {
    return String(
      order?.status || "PENDING"
    ).toUpperCase();
  }

  function packed(order) {
    return [
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(status(order));
  }

  function shipped(order) {
    return [
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(status(order));
  }

  function outForDelivery(order) {
    return [
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(status(order));
  }

  function orderDate(order) {
    if (!order?.createdAt) return "-";

    return new Date(
      order.createdAt
    ).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function orderDateTime(order) {
    if (!order?.createdAt) return "-";

    return new Date(
      order.createdAt
    ).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function orderImage(order) {
    return (
      order?.items?.[0]?.image ||
      order?.items?.[0]?.productImage ||
      order?.items?.[0]?.imageUrl ||
      ""
    );
  }

  // Toggle tracking directly underneath the order
  function toggleTracking(order) {
    const orderId =
      order.id || order.orderNumber;

    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  }

  function isExpanded(order) {
    return (
      expandedOrder ===
      (order.id || order.orderNumber)
    );
  }

  function totalItems(order) {
    return (order.items || []).reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  }

  function trackingNumber(order) {
    return (
      order.trackingNumber ||
      order.orderNumber ||
      "-"
    );
  }

  return (
    <PageLayout>
      <main className="profile-page">

        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="profile-hero">

          <div className="profile-hero-content">

            <p className="profile-eyebrow">
              MY ORCHARD ACCOUNT
            </p>

            <h1>
              Welcome back,{" "}
              {customer.name?.split(" ")[0] || "there"}.
            </h1>

            <p>
              Your orders, deliveries and seasonal
              favourites in one place.
            </p>

          </div>

          <div className="profile-hero-art">

            <span className="profile-mango profile-mango-one">
              🥭
            </span>

            <span className="profile-mango profile-mango-two">
              🥭
            </span>

            <span className="profile-leaf">
              🌿
            </span>

          </div>

        </section>


        {/* =====================================================
            ACCOUNT LAYOUT
            ===================================================== */}

        <section className="profile-container">

          {/* SIDEBAR */}

          <aside className="profile-sidebar">

            <div className="profile-account-title">

              <div className="profile-account-icon">
                👤
              </div>

              <strong>
                My Account
              </strong>

            </div>


            <nav>

              <button
                className={
                  view === "dashboard"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView("dashboard")
                }
              >
                <span>⌂</span>
                Dashboard
              </button>


              <button
                className={
                  view === "orders"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setView("orders");
                  setExpandedOrder(null);
                }}
              >
                <span>▣</span>
                My Orders
              </button>


              <button
                className={
                  view === "tracking"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setView("tracking");
                  setExpandedOrder(null);
                }}
              >
                <span>⌖</span>
                Track an order
              </button>


              <button
                onClick={() =>
                  navigate("/shop")
                }
              >
                <span>🛒</span>
                Shop mangoes
              </button>

            </nav>


            <div className="profile-sidebar-divider" />


            <button
              className="profile-logout"
              onClick={logout}
            >
              <FiLogOut />
              Sign out
            </button>

          </aside>


          {/* ===================================================
              WORKSPACE
              =================================================== */}

          <section className="profile-workspace">


            {/* =================================================
                DASHBOARD
                ================================================= */}

            {view === "dashboard" && (
              <>

                <div className="profile-metrics">

                  <article>

                    <div className="profile-metric-icon">
                      <FiPackage />
                    </div>

                    <div>
                      <span>Total orders</span>

                      <strong>
                        {orders.length}
                      </strong>
                    </div>

                  </article>


                  <article>

                    <div className="profile-metric-icon">
                      <FiTruck />
                    </div>

                    <div>
                      <span>In progress</span>

                      <strong>
                        {inProgress}
                      </strong>
                    </div>

                  </article>


                  <article>

                    <div className="profile-metric-icon">
                      <FiMapPin />
                    </div>

                    <div>
                      <span>Delivered</span>

                      <strong>
                        {delivered}
                      </strong>
                    </div>

                  </article>


                  <article>

                    <div className="profile-metric-icon">
                      <FiStar />
                    </div>

                    <div>
                      <span>Orchard points</span>

                      <strong>
                        {orchardPoints}
                      </strong>
                    </div>

                  </article>

                </div>


                <section className="profile-orders-panel">

                  <header className="profile-panel-header">

                    <div>
                      <h2>
                        Recent orders
                      </h2>

                      <p>
                        Your latest farm-fresh purchases.
                      </p>
                    </div>

                    {orders.length > 0 && (
                      <button
                        className="profile-view-all"
                        onClick={() => {
                          setView("orders");
                          setExpandedOrder(null);
                        }}
                      >
                        View all →
                      </button>
                    )}

                  </header>


                  {loading && (
                    <div className="profile-loading">
                      Loading your orchard orders…
                    </div>
                  )}


                  {!loading &&
                    orders.length === 0 && (
                      <div className="profile-empty">

                        <div className="profile-empty-icon">
                          🥭
                        </div>

                        <h3>
                          Your orchard basket is waiting.
                        </h3>

                        <p>
                          Place an order and delivery
                          updates will appear right here.
                        </p>

                        <button
                          className="profile-primary-button"
                          onClick={() =>
                            navigate("/shop")
                          }
                        >
                          Shop seasonal mangoes →
                        </button>

                      </div>
                    )}


                  {!loading &&
                    orders.slice(0, 5).map((order) => (
                      <article
                        className="profile-recent-order"
                        key={
                          order.id ||
                          order.orderNumber
                        }
                      >

                        <div>

                          <strong>
                            #{order.orderNumber}
                          </strong>

                          <span>
                            {orderDate(order)}
                          </span>

                        </div>


                        <span className="profile-recent-product">
                          {order.items?.[0]?.name ||
                            "Farm fresh product"}
                        </span>


                        <strong>
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString("en-IN")}
                        </strong>


                        <span
                          className={`profile-status status-${status(
                            order
                          ).toLowerCase()}`}
                        >
                          {status(order).replaceAll(
                            "_",
                            " "
                          )}
                        </span>

                      </article>
                    ))}

                </section>

              </>
            )}


            {/* =================================================
                MY ORDERS
                ================================================= */}

            {view === "orders" && (
              <section className="profile-orders-panel">

                <header className="profile-panel-header">

                  <div>
                    <h2>
                      My orders
                    </h2>

                    <p>
                      Every order, delivery update and
                      tracking detail in one place.
                    </p>
                  </div>

                  <button
                    className="profile-back-button"
                    onClick={() => {
                      setView("dashboard");
                      setExpandedOrder(null);
                    }}
                  >
                    ← Dashboard
                  </button>

                </header>


                {loading && (
                  <div className="profile-loading">
                    Loading your orchard orders…
                  </div>
                )}


                {!loading &&
                  orders.length === 0 && (
                    <div className="profile-empty">

                      <div className="profile-empty-icon">
                        🥭
                      </div>

                      <h3>
                        No orders yet.
                      </h3>

                      <p>
                        Your first farm-fresh order
                        is waiting.
                      </p>

                      <button
                        className="profile-primary-button"
                        onClick={() =>
                          navigate("/shop")
                        }
                      >
                        Explore mangoes
                      </button>

                    </div>
                  )}


                {!loading &&
                  orders.map((order) => {

                    const currentStatus =
                      status(order);

                    const image =
                      orderImage(order);

                    const expanded =
                      isExpanded(order);

                    return (
                      <div
                        className="profile-order-wrapper"
                        key={
                          order.id ||
                          order.orderNumber
                        }
                      >

                        {/* =================================================
                            ORDER CARD
                            ================================================= */}

                        <article className="profile-order-card">

                          {/* PRODUCT IMAGE */}

                          <div className="profile-order-image">

                            {image ? (
                              <img
                                src={image}
                                alt={
                                  order.items?.[0]
                                    ?.name ||
                                  "Farm fresh product"
                                }
                              />
                            ) : (
                              <div>
                                🥭
                              </div>
                            )}

                          </div>


                          {/* ORDER CONTENT */}

                          <div className="profile-order-content">

                            <div className="profile-order-header">

                              <div>

                                <strong>
                                  #{order.orderNumber}
                                </strong>

                                <span>
                                  {orderDate(order)}
                                </span>

                              </div>


                              <span
                                className={`profile-status status-${currentStatus.toLowerCase()}`}
                              >
                                {currentStatus.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>

                            </div>


                            <p className="profile-order-product">

                              {order.items?.[0]?.name ||
                                "Farm fresh product"}

                              <small>
                                {" × "}
                                {totalItems(order)}
                              </small>

                            </p>


                            {/* MINI PROGRESS */}

                            <div className="profile-order-progress">

                              <div className="profile-progress-line" />


                              <div className="profile-progress-step completed">

                                <div className="profile-progress-dot">
                                  ✓
                                </div>

                                <span>
                                  Order placed
                                </span>

                                <small>
                                  {orderDate(order)}
                                </small>

                              </div>


                              <div
                                className={`profile-progress-step ${
                                  packed(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="profile-progress-dot">
                                  {packed(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <span>
                                  Packed
                                </span>

                              </div>


                              <div
                                className={`profile-progress-step ${
                                  shipped(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="profile-progress-dot">
                                  {shipped(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <span>
                                  Shipped
                                </span>

                              </div>


                              <div
                                className={`profile-progress-step ${
                                  outForDelivery(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="profile-progress-dot">
                                  {outForDelivery(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <span>
                                  Out for delivery
                                </span>

                              </div>

                            </div>

                          </div>


                          {/* PRICE + TOGGLE */}

                          <div className="profile-order-action">

                            <strong>
                              ₹
                              {Number(
                                order.total || 0
                              ).toLocaleString("en-IN")}
                            </strong>


                            <button
                              type="button"
                              className={`profile-track-button ${
                                expanded
                                  ? "expanded"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleTracking(order)
                              }
                            >

                              <FiTruck />

                              {expanded ? (
                                <>
                                  Hide tracking
                                  <FiChevronUp />
                                </>
                              ) : (
                                <>
                                  Track order
                                  <FiChevronDown />
                                </>
                              )}

                            </button>

                          </div>

                        </article>


                        {/* =================================================
                            EXPANDED TRACKING
                            ================================================= */}

                        {expanded && (
                          <section className="profile-inline-tracking">

                            {/* HEADER */}

                            <div className="profile-inline-top">

                              <div className="profile-inline-tracking-header">

                                <div className="profile-inline-order-icon">
                                  📦
                                </div>

                                <div className="profile-inline-order-info">

                                  <span>
                                    ORDER NUMBER
                                  </span>

                                  <h3>
                                    {order.orderNumber}
                                  </h3>

                                  <p>
                                    Fresh from our farm
                                    <b> • </b>
                                    On its way to you
                                  </p>

                                </div>

                              </div>


                              <div className="profile-inline-status">

                                <span
                                  className={`profile-status status-${currentStatus.toLowerCase()}`}
                                >
                                  {currentStatus.replaceAll(
                                    "_",
                                    " "
                                  )}
                                </span>

                              </div>


                              <div className="profile-inline-delivery">

                                <div className="profile-inline-delivery-icon">
                                  ⌖
                                </div>

                                <div>

                                  <span>
                                    Estimated delivery
                                  </span>

                                  <strong>
                                    {order.estimatedDeliveryDays
                                      ? `${order.estimatedDeliveryDays} days`
                                      : "3 days"}{" "}
                                    🌿
                                  </strong>

                                  <p>
                                    We'll notify you once
                                    it's out for delivery.
                                  </p>

                                </div>

                              </div>

                            </div>


                            <div className="profile-inline-divider" />


                            {/* LARGE TIMELINE */}

                            <div className="profile-inline-timeline">

                              <div className="profile-inline-timeline-line" />


                              <div className="profile-inline-step completed">

                                <div className="profile-inline-dot">
                                  ✓
                                </div>

                                <h4>
                                  Order placed
                                </h4>

                                <p>
                                  {orderDateTime(order)}
                                </p>

                              </div>


                              <div
                                className={`profile-inline-step ${
                                  packed(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="profile-inline-dot">
                                  {packed(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <h4>
                                  Packed with care
                                </h4>

                                <p>
                                  Your order is being
                                  carefully packed with
                                  farm-fresh products.
                                </p>

                              </div>


                              <div
                                className={`profile-inline-step ${
                                  shipped(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="profile-inline-dot">
                                  {shipped(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <h4>
                                  Shipped from our farm
                                </h4>

                                <p>
                                  On the way to your
                                  location.
                                </p>

                              </div>


                              <div
                                className={`profile-inline-step ${
                                  outForDelivery(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="profile-inline-dot">
                                  {outForDelivery(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <h4>
                                  Out for delivery
                                </h4>

                                <p>
                                  Arriving at your
                                  doorstep soon.
                                </p>

                              </div>

                            </div>


                            {/* INFO BAR */}

                            <div className="profile-inline-info">

                              <div>

                                <span>
                                  🚚
                                </span>

                                <div>
                                  <small>
                                    Tracking number
                                  </small>

                                  <strong>
                                    {trackingNumber(order)}
                                  </strong>
                                </div>

                              </div>


                              <div>

                                <span>
                                  🌿
                                </span>

                                <div>
                                  <small>
                                    Order type
                                  </small>

                                  <strong>
                                    Fresh produce
                                  </strong>
                                </div>

                              </div>


                              <div>

                                <span>
                                  📦
                                </span>

                                <div>
                                  <small>
                                    Items
                                  </small>

                                  <strong>
                                    {totalItems(order)}{" "}
                                    farm fresh item
                                    {totalItems(order) !== 1
                                      ? "s"
                                      : ""}
                                  </strong>
                                </div>

                              </div>

                            </div>


                            {/* ORDER TIMELINE EVENTS */}

                            {Array.isArray(
                              order.timeline
                            ) &&
                              order.timeline.length > 0 && (
                                <div className="profile-order-events">

                                  <h4>
                                    Latest updates
                                  </h4>

                                  {order.timeline
                                    .slice()
                                    .reverse()
                                    .slice(0, 4)
                                    .map(
                                      (
                                        event,
                                        index
                                      ) => (
                                        <div
                                          className="profile-order-event"
                                          key={`${event.status}-${index}`}
                                        >

                                          <span className="profile-event-dot" />

                                          <div>

                                            <strong>
                                              {String(
                                                event.status ||
                                                  "UPDATE"
                                              ).replaceAll(
                                                "_",
                                                " "
                                              )}
                                            </strong>

                                            <p>
                                              {event.note ||
                                                "Order update"}
                                            </p>

                                          </div>

                                        </div>
                                      )
                                    )}

                                </div>
                              )}

                          </section>
                        )}

                      </div>
                    );
                  })}

              </section>
            )}


            {/* =================================================
                TRACKING VIEW
                ================================================= */}

            {view === "tracking" && (
              <section className="profile-orders-panel">

                <header className="profile-panel-header">

                  <div>
                    <h2>
                      Track your mango order
                    </h2>

                    <p>
                      Select an order to expand its
                      latest delivery status.
                    </p>
                  </div>

                </header>


                {orders.length === 0 ? (
                  <div className="profile-empty">

                    <div className="profile-empty-icon">
                      📦
                    </div>

                    <h3>
                      No orders to track
                    </h3>

                    <button
                      className="profile-primary-button"
                      onClick={() =>
                        navigate("/shop")
                      }
                    >
                      Shop mangoes
                    </button>

                  </div>
                ) : (
                  <div className="profile-tracking-list">

                    {orders.map((order) => {

                      const expanded =
                        isExpanded(order);

                      return (
                        <div
                          className="profile-tracking-wrapper"
                          key={
                            order.id ||
                            order.orderNumber
                          }
                        >

                          <button
                            type="button"
                            className={`profile-tracking-order ${
                              expanded
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              toggleTracking(order)
                            }
                          >

                            <div className="profile-tracking-icon">
                              <FiPackage />
                            </div>

                            <div>

                              <strong>
                                #{order.orderNumber}
                              </strong>

                              <span>
                                {order.items?.[0]?.name ||
                                  "Farm fresh order"}
                              </span>

                            </div>

                            <span
                              className={`profile-status status-${status(
                                order
                              ).toLowerCase()}`}
                            >
                              {status(order).replaceAll(
                                "_",
                                " "
                              )}
                            </span>

                            <span className="profile-tracking-arrow">
                              {expanded ? "⌃" : "→"}
                            </span>

                          </button>


                          {expanded && (
                            <div className="profile-tracking-mini-panel">

                              <div>
                                <strong>
                                  Order placed
                                </strong>

                                <span>
                                  {orderDateTime(order)}
                                </span>
                              </div>

                              <div>
                                <strong>
                                  Current status
                                </strong>

                                <span>
                                  {status(order).replaceAll(
                                    "_",
                                    " "
                                  )}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setView("orders")
                                }
                              >
                                View full order details →
                              </button>

                            </div>
                          )}

                        </div>
                      );
                    })}

                  </div>
                )}

              </section>
            )}

          </section>

        </section>

      </main>
    </PageLayout>
  );
}