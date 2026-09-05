import { useState } from "react";
import { FaCheckCircle, FaShieldAlt, FaTruck } from "react-icons/fa";
import PageLayout from "../components/layout/PageLayout";
import { useShop } from "../context/ShopContext";
import {
  completePayment,
  createOrder,
  getDeliveryQuote,
} from "../services/productService";
import "./PaymentCheckout.css";

export default function CodCheckout() {
  const { cart } = useShop();

  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(null);

  // Store PIN separately so the right-side summary can update immediately
  const [pinCode, setPinCode] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const delivery = quote?.fee || 0;
  const total = subtotal + delivery;

  async function quotePin(pin) {
    const cleanPin = pin.trim();

    setPinCode(cleanPin);

    // Clear previous quote when PIN changes
    setQuote(null);

    if (cleanPin.length < 5) {
      setMessage("");
      return;
    }

    try {
      const result = await getDeliveryQuote(cleanPin, subtotal);

      setQuote(result);
      setMessage("");
    } catch (error) {
      setQuote(null);
      setMessage(error.message || "This PIN code is not deliverable.");
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (!cart.length) {
      return setMessage("Your cart is empty.");
    }

    if (!quote) {
      return setMessage(
        "Enter a deliverable PIN code before placing your order."
      );
    }

    const data = new FormData(event.currentTarget);

    setBusy(true);

    try {
      const created = await createOrder({
        customerName: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        address: [
          data.get("address"),
          data.get("city"),
          data.get("state"),
        ]
          .filter(Boolean)
          .join(", "),
        pincode: data.get("pin"),
        paymentMethod: "COD",
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      setOrder(await completePayment(created.orderNumber, "COD"));
    } catch (error) {
      setMessage(
        error.message || "Checkout could not be completed."
      );
    } finally {
      setBusy(false);
    }
  }

  if (order) {
    return (
      <PageLayout>
        <main className="payment-page">
          <section className="payment-success">
            <FaCheckCircle />

            <p>Order confirmed</p>

            <h1>
              Thank you for choosing Maviina Mane.
            </h1>

            <span>
              Your COD order <b>#{order.orderNumber}</b> is being prepared.
            </span>

            <div>
              <b>₹{order.total}</b>
              <small>
                Cash on Delivery · Payment pending
              </small>
            </div>

            <a href="/track-order">
              Track your order
            </a>
          </section>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="payment-page">

        {/* =========================
            CHECKOUT HEADING
        ========================= */}

        <header className="payment-heading">
          <p>ORCHARD CHECKOUT</p>

          <h1>Freshness, on its way.</h1>

          <span>
            Confirm your delivery location and pay when your mangoes arrive.
          </span>
        </header>

        <form
          className="payment-layout"
          onSubmit={submit}
        >

          {/* =========================
              LEFT SIDE
          ========================= */}

          <section className="payment-card">

            {/* DELIVERY DETAILS */}

            <div className="checkout-step">
              <span>01</span>

              <div>
                <h2>Delivery details</h2>

                <p>
                  We validate your PIN code before placing the order.
                </p>
              </div>
            </div>

            <div className="payment-fields">

              <label>
                Full name

                <input
                  name="name"
                  required
                />
              </label>

              <label>
                Phone

                <input
                  name="phone"
                  required
                />
              </label>

              <label>
                Email

                <input
                  name="email"
                  type="email"
                  required
                />
              </label>

              <label>
                PIN code

                <input
                  name="pin"
                  value={pinCode}
                  required
                  onChange={(event) => {
                    const value = event.target.value.replace(
                      /\D/g,
                      ""
                    );

                    setPinCode(value);
                    setQuote(null);
                    setMessage("");
                  }}
                  onBlur={(event) => {
                    quotePin(event.target.value);
                  }}
                  maxLength="6"
                  placeholder="Enter PIN code"
                />
              </label>

              <label className="wide">
                Address

                <textarea
                  name="address"
                  required
                />
              </label>

              <label>
                City

                <input
                  name="city"
                  required
                />
              </label>

              <label>
                State

                <input
                  name="state"
                  required
                />
              </label>

            </div>

            {/* DELIVERY RESULT */}

            {quote && (
              <p className="secure-note">
                <FaTruck />

                {quote.zone}: estimated delivery in{" "}
                {quote.estimatedDays} days.
              </p>
            )}

            {/* PAYMENT METHOD */}

            <div className="checkout-step payment-step">
              <span>02</span>

              <div>
                <h2>Payment method</h2>

                <p>
                  Cash on Delivery only. Pay the delivery partner
                  when your order arrives.
                </p>
              </div>
            </div>

            <div className="payment-methods">

              <label className="chosen">

                <input
                  type="radio"
                  checked
                  readOnly
                />

                <span>
                  <b>Cash on Delivery</b>

                  <small>
                    Pay in cash when your mangoes arrive
                  </small>
                </span>

              </label>

            </div>

            <button
              className="pay-button"
              disabled={busy}
            >
              {busy
                ? "Placing order..."
                : "Place COD order"}
            </button>

            {message && (
              <p className="payment-error">
                {message}
              </p>
            )}

          </section>

          {/* =========================
              RIGHT SIDE SUMMARY
          ========================= */}

          <aside className="payment-summary">

            <div className="summary-top">
              <span>YOUR BASKET</span>

              <h2>Order summary</h2>
            </div>

            {/* PRODUCTS */}

            {cart.map((item) => (
              <article key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                />

                <span>
                  {item.name}

                  <small>
                    {item.quantity} Kg box
                  </small>
                </span>

                <b>
                  ₹{item.price * item.quantity}
                </b>

              </article>
            ))}

            {/* PRICE SUMMARY */}

            <div className="summary-prices">

              <span>Subtotal</span>

              <b>
                ₹{subtotal}
              </b>

              <span>Delivery</span>

              <b>
                {quote
                  ? `₹${delivery}`
                  : pinCode
                    ? "Checking..."
                    : "Enter PIN"}
              </b>

              <strong>
                Total

                <em>
                  ₹{total}
                </em>
              </strong>

            </div>

            {/* PIN DISPLAY */}

            {pinCode && (
              <div className="summary-pin">
                <span>Delivery PIN</span>

                <strong>
                  {pinCode}
                </strong>
              </div>
            )}

            <p className="summary-guarantee">
              <FaShieldAlt />

              Farm-fresh guarantee
            </p>

          </aside>

        </form>
      </main>
    </PageLayout>
  );
}