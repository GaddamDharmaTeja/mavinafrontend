import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaMinus,
  FaPlus,
  FaTrash,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import PageLayout from "../components/layout/PageLayout";
import { useShop } from "../context/ShopContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, changeQuantity } = useShop();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const handleQuantityChange = (id, quantity) => {
    const value = Math.max(1, Number(quantity) || 1);
    changeQuantity(id, value);
  };

  return (
    <PageLayout>
      <main className="cart-page">

        {/* =========================
            CART HEADER
        ========================= */}
        <section className="cart-heading">
          <div className="cart-breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Cart</span>
          </div>

          <h1>Your Cart</h1>

          <p>
            Fresh goodness, just a step away from your home.
          </p>
        </section>

        {cart.length ? (
          <div className="cart-layout">

            {/* =========================
                CART ITEMS
            ========================= */}
            <section className="cart-list">

              {cart.map((item) => {
                const itemTotal =
                  Number(item.price || 0) * Number(item.quantity || 0);

                return (
                  <article className="cart-row" key={item.id}>

                    <Link
                      to={`/products/${item.id}`}
                      className="cart-image-link"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-image"
                      />
                    </Link>

                    <div className="cart-product-info">

                      <h2>
                        <Link to={`/products/${item.id}`}>
                          {item.name}
                        </Link>
                      </h2>

                      <p className="cart-price">
                        ₹{item.price} / {item.weight || "kg"}
                      </p>

                      <span className="fresh-badge">
                        <FaLeaf />
                        Fresh from our farms
                      </span>
                    </div>

                    {/* QUANTITY */}
                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Number(item.quantity) - 1
                          )
                        }
                        disabled={Number(item.quantity) <= 1}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <FaMinus />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Number(item.quantity) + 1
                          )
                        }
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <FaPlus />
                      </button>

                    </div>

                    {/* ITEM TOTAL */}
                    <strong className="cart-item-total">
                      ₹{itemTotal}
                    </strong>

                    {/* REMOVE */}
                    <button
                      className="remove-btn"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <FaTrash />
                      <span>Remove</span>
                    </button>

                  </article>
                );
              })}

              {/* CONTINUE SHOPPING */}
              <Link to="/shop" className="continue-shopping">
                ← Continue Shopping
              </Link>

            </section>

            {/* =========================
                ORDER SUMMARY
            ========================= */}
            <aside className="order-summary">

              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>
                  Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
                <strong>₹{total}</strong>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <strong className="free-delivery">
                  Free
                </strong>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>

              <Link
                to="/checkout"
                className="checkout-btn"
              >
                Proceed to checkout
                <span>→</span>
              </Link>

              {/* TRUST BADGES */}
              <div className="cart-trust">

                <div className="trust-item">
                  <FaLeaf />
                  <strong>100%</strong>
                  <span>Natural</span>
                </div>

                <div className="trust-item">
                  <FaTruck />
                  <strong>Secure</strong>
                  <span>Delivery</span>
                </div>

                <div className="trust-item">
                  <FaShieldAlt />
                  <strong>Safe</strong>
                  <span>Payments</span>
                </div>

              </div>

            </aside>

          </div>
        ) : (

          /* =========================
             EMPTY CART
          ========================= */
          <section className="empty-cart">

            <div className="empty-cart-icon">
              <FaLeaf />
            </div>

            <h2>Your basket is waiting</h2>

            <p>
              Your basket is waiting for fresh mangoes.
            </p>

            <Link to="/shop">
              Browse mangoes →
            </Link>

          </section>
        )}

      </main>
    </PageLayout>
  );
}

export default Cart;