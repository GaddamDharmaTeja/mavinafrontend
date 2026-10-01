import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { getMyOrders } from "../services/productService";
import "./CommercePages.css";
import "./CustomerOrders.css";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");
  const [sort, setSort] = useState("latest");

  const customer = JSON.parse(
    localStorage.getItem("customer") || "null"
  );

  useEffect(() => {
    if (!customer) return;

    getMyOrders()
      .then((items) => {
        setOrders(Array.isArray(items) ? items : []);
        setState("ready");
      })
      .catch((error) => {
        console.error("Get my orders error:", error);
        setState("error");
      });
  }, [customer]);

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  /* ============================================================
     ORDER HELPERS
     ============================================================ */

  const getStatus = (order) =>
    String(order?.status || "PENDING").toUpperCase();

  const isPacked = (order) =>
    [
      "PACKED",
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(getStatus(order));

  const isShipped = (order) =>
    [
      "SHIPPED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(getStatus(order));

  const isOutForDelivery = (order) =>
    [
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ].includes(getStatus(order));

  const isDelivered = (order) =>
    getStatus(order) === "DELIVERED";

  const getItemImage = (order) => {
    const item = order?.items?.[0];

    return (
      item?.image ||
      item?.productImage ||
      item?.imageUrl ||
      ""
    );
  };

  const getOrderDate = (order) => {
    if (!order?.createdAt) return "-";

    return new Date(order.createdAt).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getItemCount = (order) =>
    (order?.items || []).reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );

  /* ============================================================
     SORT
     ============================================================ */

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return sort === "latest"
      ? dateB - dateA
      : dateA - dateB;
  });

  /* ============================================================
     COUNTS
     ============================================================ */

  const deliveredCount = orders.filter(
    (order) => isDelivered(order)
  ).length;

  const progressCount =
    orders.length - deliveredCount;

  const loyaltyPoints = orders.length * 50;

  return (
    <PageLayout>

      <main className="customer-orders-page">

        {/* ======================================================
            HERO
            ====================================================== */}

        <section className="customer-orders-hero">

          <div className="customer-orders-hero-content">

            <p className="customer-orders-eyebrow">
              MY ORCHARD ACCOUNT
            </p>

            <h1>
              Welcome back,{" "}
              {customer?.name ||
                customer?.firstName ||
                "there"}
              .
            </h1>

            <p>
              Your orders, deliveries and seasonal
              favourites in one place.
            </p>

          </div>

          <div className="customer-orders-hero-art">
            <div className="mango mango-one">🥭</div>
            <div className="mango mango-two">🥭</div>
            <div className="mango-leaf">🌿</div>
          </div>

        </section>


        {/* ======================================================
            CONTENT
            ====================================================== */}

        <section className="customer-orders-container">

          {/* ====================================================
              SIDEBAR
              ==================================================== */}

          <aside className="customer-orders-sidebar">

            <div className="customer-account-heading">

              <div className="customer-account-icon">
                ♙
              </div>

              <strong>
                My Account
              </strong>

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


            <div className="customer-sidebar-divider" />


            <button
              type="button"
              className="customer-signout"
              onClick={() => {
                localStorage.removeItem("customer");
                window.location.href = "/";
              }}
            >
              <span>⇥</span>
              Sign out
            </button>

          </aside>


          {/* ====================================================
              MAIN
              ==================================================== */}

          <section className="customer-orders-main">

            {/* ==================================================
                METRICS
                ================================================== */}

            <div className="customer-order-metrics">

              <div className="customer-order-metric">

                <div className="customer-metric-icon">
                  ▣
                </div>

                <div>
                  <span>Total orders</span>
                  <strong>{orders.length}</strong>
                </div>

              </div>


              <div className="customer-order-metric">

                <div className="customer-metric-icon">
                  📦
                </div>

                <div>
                  <span>In progress</span>
                  <strong>{progressCount}</strong>
                </div>

              </div>


              <div className="customer-order-metric">

                <div className="customer-metric-icon">
                  🚚
                </div>

                <div>
                  <span>Delivered</span>
                  <strong>{deliveredCount}</strong>
                </div>

              </div>


              <div className="customer-order-metric">

                <div className="customer-metric-icon">
                  ☆
                </div>

                <div>
                  <span>Loyalty points</span>
                  <strong>{loyaltyPoints}</strong>
                </div>

              </div>

            </div>


            {/* ==================================================
                ORDER PANEL
                ================================================== */}

            <section className="customer-orders-panel">

              <header className="customer-orders-panel-header">

                <div>
                  <h2>
                    My orders
                  </h2>

                  <p>
                    Every order, delivery update and
                    tracking detail in one place.
                  </p>
                </div>


                {state === "ready" &&
                  orders.length > 0 && (
                    <div className="customer-orders-sort">

                      <span>
                        Sort by
                      </span>

                      <select
                        value={sort}
                        onChange={(e) =>
                          setSort(e.target.value)
                        }
                      >
                        <option value="latest">
                          Latest first
                        </option>

                        <option value="oldest">
                          Oldest first
                        </option>
                      </select>

                    </div>
                  )}

              </header>


              {/* =================================================
                  LOADING
                  ================================================= */}

              {state === "loading" && (
                <section className="customer-orders-state">

                  <div className="customer-loading-icon">
                    🥭
                  </div>

                  <h3>
                    Loading your orchard orders...
                  </h3>

                  <p>
                    We're bringing your latest
                    order details.
                  </p>

                </section>
              )}


              {/* =================================================
                  ERROR
                  ================================================= */}

              {state === "error" && (
                <section className="customer-orders-state">

                  <div className="customer-state-icon">
                    !
                  </div>

                  <h3>
                    We couldn't load your orders
                  </h3>

                  <p>
                    Your account is still safe.
                    Please refresh and try again.
                  </p>

                  <button
                    className="customer-primary-button"
                    onClick={() =>
                      window.location.reload()
                    }
                  >
                    Try again
                  </button>

                </section>
              )}


              {/* =================================================
                  EMPTY
                  ================================================= */}

              {state === "ready" &&
                !orders.length && (
                  <section className="customer-orders-state">

                    <div className="customer-state-icon">
                      🥭
                    </div>

                    <h3>
                      Your first box is waiting
                    </h3>

                    <p>
                      Once you order, its packing and
                      delivery updates will appear here.
                    </p>

                    <Link
                      className="customer-primary-button"
                      to="/shop"
                    >
                      Explore mangoes
                    </Link>

                  </section>
                )}


              {/* =================================================
                  ORDERS
                  ================================================= */}

              {state === "ready" &&
                sortedOrders.length > 0 && (

                  <div className="customer-order-list">

                    {sortedOrders.map((order) => {

                      const status =
                        getStatus(order);

                      const image =
                        getItemImage(order);

                      return (
                        <article
                          className="customer-order-card"
                          key={
                            order.id ||
                            order.orderNumber
                          }
                        >

                          {/* PRODUCT IMAGE */}

                          <div className="customer-order-image">

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


                          {/* ORDER DETAILS */}

                          <div className="customer-order-content">

                            <div className="customer-order-top">

                              <div>

                                <div className="customer-order-number">

                                  #{order.orderNumber}

                                  <span>
                                    {getOrderDate(order)}
                                  </span>

                                </div>


                                <div className="customer-order-product">

                                  {order.items?.[0]
                                    ?.name ||
                                    "Farm fresh product"}

                                  <small>
                                    {" "}
                                    ×{" "}
                                    {getItemCount(order)}
                                  </small>

                                </div>

                              </div>


                              <span
                                className={`customer-order-status status-${status.toLowerCase()}`}
                              >
                                {status.replaceAll(
                                  "_",
                                  " "
                                )}
                              </span>

                            </div>


                            {/* PROGRESS */}

                            <div className="customer-order-progress">

                              <div className="customer-progress-line" />


                              <div className="customer-progress-step completed">

                                <div className="customer-progress-dot">
                                  ✓
                                </div>

                                <span>
                                  Order placed
                                </span>

                                <small>
                                  {getOrderDate(order)}
                                </small>

                              </div>


                              <div
                                className={`customer-progress-step ${
                                  isPacked(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="customer-progress-dot">
                                  {isPacked(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <span>
                                  Packed
                                </span>

                              </div>


                              <div
                                className={`customer-progress-step ${
                                  isShipped(order)
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="customer-progress-dot">
                                  {isShipped(order)
                                    ? "✓"
                                    : ""}
                                </div>

                                <span>
                                  Shipped
                                </span>

                              </div>


                              <div
                                className={`customer-progress-step ${
                                  isOutForDelivery(
                                    order
                                  )
                                    ? "completed"
                                    : ""
                                }`}
                              >

                                <div className="customer-progress-dot">
                                  {isOutForDelivery(
                                    order
                                  )
                                    ? "✓"
                                    : ""}
                                </div>

                                <span>
                                  Out for delivery
                                </span>

                              </div>

                            </div>


                            {/* TIMELINE DETAILS */}

                            {Array.isArray(
                              order.timeline
                            ) &&
                              order.timeline.length >
                                0 && (

                                <div className="customer-mini-timeline">

                                  {order.timeline
                                    .slice(-3)
                                    .map(
                                      (
                                        event,
                                        index
                                      ) => (
                                        <div
                                          key={`${event.status}-${index}`}
                                          className={
                                            index ===
                                            order.timeline.slice(
                                              -3
                                            ).length -
                                              1
                                              ? "current"
                                              : ""
                                          }
                                        >
                                          <strong>
                                            {String(
                                              event.status ||
                                                "UPDATE"
                                            ).replaceAll(
                                              "_",
                                              " "
                                            )}
                                          </strong>

                                          <span>
                                            {event.note ||
                                              "Order update"}
                                          </span>
                                        </div>
                                      )
                                    )}

                                </div>
                              )}

                          </div>


                          {/* PRICE */}

                          <div className="customer-order-action">

                            <strong className="customer-order-total">
                              ₹
                              {Number(
                                order.total || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            <Link
                              className="customer-track-button"
                              to={`/track-order?order=${encodeURIComponent(
                                order.orderNumber ||
                                  ""
                              )}`}
                            >
                              <span>🚚</span>
                              Track order
                            </Link>

                          </div>

                        </article>
                      );
                    })}

                  </div>
                )}

            </section>

          </section>

        </section>

      </main>

    </PageLayout>
  );
}