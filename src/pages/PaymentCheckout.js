import { useState } from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";
import PageLayout from "../components/layout/PageLayout";
import { useShop } from "../context/ShopContext";
import {
  completePayment,
  createOrder,
  createRazorpayOrder,
  getDeliveryQuote,
  getRazorpayConfig,
  verifyPayment,
} from "../services/productService";
import "./PaymentCheckout.css";

const methods = [
  {
    id: "RAZORPAY",
    title: "Pay securely online",
    detail: "UPI, cards, net banking & wallets",
    icon: <FaCreditCard />,
  },
  {
    id: "COD",
    title: "Cash on delivery",
    detail: "Pay when your mangoes arrive",
    icon: <FaTruck />,
  },
];

function PaymentCheckout() {
  const { cart } = useShop();

  const [method, setMethod] = useState("RAZORPAY");
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [quote, setQuote] = useState(null);
  const [pinCode, setPinCode] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  /*
   * Use delivery quote when PIN is valid.
   * Otherwise use default delivery calculation.
   */
  const delivery =
    quote?.fee !== undefined
      ? Number(quote.fee)
      : subtotal >= 1000
      ? 0
      : 50;

  const discount = subtotal >= 1000 ? 100 : 0;

  const total = Math.max(
    0,
    subtotal + delivery - discount
  );

  /*
   * Validate PIN and get delivery quote
   */
  async function quoteDelivery(pin) {
    const cleanPin = pin.trim();

    setPinCode(cleanPin);

    if (cleanPin.length < 6) {
      setQuote(null);
      return;
    }

    try {
      setError("");

      const result = await getDeliveryQuote(
        cleanPin,
        subtotal
      );

      console.log("DELIVERY QUOTE RESPONSE:", result);

      setQuote(result);
    } catch (error) {
      setQuote(null);
      setError(
        error.message || "Delivery is not available for this PIN code."
      );
    }
  }

  async function submit(event) {
    event.preventDefault();

    if (!cart.length) {
      setError(
        "Your cart is empty. Add mangoes before checking out."
      );
      return;
    }

    if (!quote) {
      setError(
        "Please enter a valid deliverable PIN code before placing your order."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData(event.currentTarget);

      const address = [
        form.get("address"),
        form.get("city"),
        form.get("state"),
        form.get("pin"),
      ]
        .filter(Boolean)
        .join(", ");

      const order = await createOrder({
        customerName: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        address,
        pincode: form.get("pin"),
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      /*
       * COD
       */
      if (method === "COD") {
        setPayment(
          await completePayment(
            order.orderNumber,
            method
          )
        );

        return;
      }

      /*
       * Razorpay
       */
      const [{ keyId }, gatewayOrder] =
        await Promise.all([
          getRazorpayConfig(),
          createRazorpayOrder(
            total,
            order.orderNumber
          ),
        ]);

      const verified = await new Promise(
        (resolve, reject) => {
          if (!window.Razorpay) {
            reject(
              new Error(
                "Payment window is unavailable"
              )
            );
            return;
          }

          const checkout = new window.Razorpay({
            key: keyId,
            amount: gatewayOrder.amount,
            currency: gatewayOrder.currency,
            name: "Maviina Mane",
            description: "Fresh mango order",
            order_id: gatewayOrder.id,

            prefill: {
              name: form.get("name"),
              email: form.get("email"),
              contact: form.get("phone"),
            },

            theme: {
              color: "#11642a",
            },

            handler: async (response) => {
              try {
                resolve(
                  await verifyPayment({
                    orderNumber:
                      order.orderNumber,

                    razorpayOrderId:
                      response.razorpay_order_id,

                    razorpayPaymentId:
                      response.razorpay_payment_id,

                    razorpaySignature:
                      response.razorpay_signature,
                  })
                );
              } catch (e) {
                reject(e);
              }
            },

            modal: {
              ondismiss: () =>
                reject(
                  new Error("Payment cancelled")
                ),
            },
          });

          checkout.open();
        }
      );

      setPayment(verified);
    } catch (e) {
      setError(
        e.message ||
          "We could not complete payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * SUCCESS SCREEN
   */
  if (payment) {
    return (
      <PageLayout>
        <main className="payment-page">
          <section className="payment-success">
            <FaCheckCircle />

            <p>Order confirmed</p>

            <h1>
              Thank you for choosing Maviina Mane!
            </h1>

            <span>
              Order{" "}
              <b>#{payment.orderNumber}</b>{" "}
              is confirmed. Your reference is{" "}
              <b>{payment.transactionId}</b>.
            </span>

            <div>
              <b>₹{payment.total}</b>

              <small>
                {payment.paymentMethod} ·{" "}
                {payment.paymentStatus}
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

  /*
   * CHECKOUT SCREEN
   */
  return (
    <PageLayout>
      <main className="payment-page">

        <header className="payment-heading">
          <p>
            <FaLock /> ENCRYPTED CHECKOUT
          </p>

          <h1>Almost yours.</h1>

          <span>
            Tell us where to deliver your freshly
            harvested mangoes.
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

            <div className="checkout-step">
              <span>01</span>

              <div>
                <h2>Delivery details</h2>

                <p>
                  We’ll keep you updated from
                  orchard to doorstep.
                </p>
              </div>
            </div>

            <div className="payment-fields">

              <label>
                Full name

                <input
                  name="name"
                  required
                  placeholder="Your name"
                />
              </label>

              <label>
                Phone number

                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="98765 43210"
                />
              </label>

              <label>
                Email

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>

              <label>
                PIN code

                <input
                  name="pin"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  required
                  value={pinCode}
                  placeholder="560001"

                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setPinCode(value);

                    if (value.length === 6) {
                      quoteDelivery(value);
                    } else {
                      setQuote(null);
                    }
                  }}
                />
              </label>

              <label className="wide">
                Address

                <textarea
                  name="address"
                  required
                  placeholder="House number, street and locality"
                />
              </label>

              <label>
                City

                <input
                  name="city"
                  required
                  placeholder="Bengaluru"
                />
              </label>

              <label>
                State

                <select
                  name="state"
                  defaultValue="Karnataka"
                >
                  <option>
                    Karnataka
                  </option>

                  <option>
                    Andhra Pradesh
                  </option>

                  <option>
                    Telangana
                  </option>

                  <option>
                    Maharashtra
                  </option>
                </select>
              </label>

            </div>

            {/* DELIVERY RESULT */}

            {quote && (
              <p className="secure-note delivery-success">
                <FaTruck />

                <span>
                  <b>{quote.zone}</b>
                  <br />
                  Estimated delivery in{" "}
                  {quote.estimatedDays} days.
                </span>
              </p>
            )}

            <div className="checkout-step payment-step">
              <span>02</span>

              <div>
                <h2>Choose how to pay</h2>

                <p>
                  Online payments are processed
                  securely by Razorpay.
                </p>
              </div>
            </div>

            <div className="payment-methods">

              {methods.map((item) => (
                <label
                  className={
                    method === item.id
                      ? "chosen"
                      : ""
                  }
                  key={item.id}
                >

                  <input
                    type="radio"
                    name="method"
                    checked={
                      method === item.id
                    }
                    onChange={() =>
                      setMethod(item.id)
                    }
                  />

                  <span className="payment-icon">
                    {item.icon}
                  </span>

                  <span>
                    <b>{item.title}</b>

                    <small>
                      {item.detail}
                    </small>
                  </span>

                </label>
              ))}

            </div>

            <p className="secure-note">
              <FaShieldAlt />

              Your payment details are never
              stored by Maviina Mane.
            </p>

            <button
              className="pay-button"
              disabled={loading}
            >
              {loading
                ? "Opening secure payment..."
                : method === "COD"
                ? "Place cash-on-delivery order"
                : `Pay securely · ₹${total}`}
            </button>

            {error && (
              <p className="payment-error">
                {error}
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

            {cart.map((item) => (
              <article key={item.id}>

                <img
                  src={item.image}
                  alt={item.name}
                />

                <span>
                  {item.name}

                  <small>
                    {item.quantity} ×{" "}
                    {item.weight || "1 Kg"}
                  </small>
                </span>

                <b>
                  ₹
                  {Number(item.price) *
                    item.quantity}
                </b>

              </article>
            ))}

            <div className="summary-total">

              <span>Subtotal</span>

              <b>₹{subtotal}</b>

              <span>Delivery</span>

              <b>
                {quote
                  ? delivery === 0
                    ? "Free"
                    : `₹${delivery}`
                  : "Enter PIN"}
              </b>

              {discount > 0 && (
                <>
                  <span>
                    Fresh harvest discount
                  </span>

                  <b className="discount">
                    -₹{discount}
                  </b>
                </>
              )}

              <strong>
                <span>Total</span>

                <em>
                  ₹{total}
                </em>
              </strong>

            </div>

            {/* PIN DISPLAY */}

            {pinCode.length === 6 && (
              <div className="summary-pin">
                <span>Delivery PIN</span>

                <b>{pinCode}</b>
              </div>
            )}

            <p className="summary-guarantee">
              <FaShieldAlt />

              Freshness guaranteed
            </p>

          </aside>

        </form>
      </main>
    </PageLayout>
  );
}

export default PaymentCheckout;