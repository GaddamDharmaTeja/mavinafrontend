import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeadset, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import PageLayout from "../components/layout/PageLayout";
import { useShop } from "../context/ShopContext";
import { getMyOrders, getProducts, submitContactMessage } from "../services/productService";
import "./CommercePages.css";

const PageTitle=({eyebrow,title,text})=><header className="page-title"><p>{eyebrow}</p><h1>{title}</h1>{text&&<span>{text}</span>}</header>;
const useCatalog=()=>{const [catalog,setCatalog]=useState([]);useEffect(()=>{getProducts().then(setCatalog).catch(()=>setCatalog([]));},[]);return catalog;};
const Summary=({items})=>{const total=items.reduce((sum,item)=>sum+item.price*(item.quantity||1),0);return <aside className="checkout-summary"><h2>Order summary</h2>{items.length?items.map(item=><div className="summary-item" key={item.id}><img src={item.image} alt=""/><span>{item.name} Mangoes<br/><small>{item.quantity||1} Kg box</small></span><b>₹{item.price*(item.quantity||1)}</b></div>):<p>Your cart is empty.</p>}<div className="summary-total"><span>Subtotal</span><b>₹{total}</b><span>Delivery</span><b>Free</b><strong>Total <em>₹{total}</em></strong></div></aside>};

export function Checkout() {
    const { cart } = useShop();
    const [saved, setSaved] = useState(false);

    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="Checkout"
                    title="Delivery details"
                    text="Fresh mangoes, carefully packed for your doorstep."
                />

                <div className="two-column">
                    <form
                        className="panel form-grid"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSaved(true);
                        }}
                    >
                        <h2>Delivery Address</h2>

                        <label>
                            Full Name
                            <input
                                required
                                placeholder="Your name"
                            />
                        </label>

                        <label>
                            Phone Number
                            <input
                                required
                                type="tel"
                                placeholder="98765 43210"
                            />
                        </label>

                        <label className="full">
                            Address
                            <textarea
                                required
                                placeholder="House number, street and locality"
                            />
                        </label>

                        <label>
                            City
                            <input
                                required
                                placeholder="Bengaluru"
                            />
                        </label>

                        <label>
                            State
                            <select defaultValue="Karnataka">
                                <option>Karnataka</option>
                                <option>Andhra Pradesh</option>
                                <option>Telangana</option>
                            </select>
                        </label>

                        <label>
                            PIN Code
                            <input
                                required
                                placeholder="560001"
                            />
                        </label>

                        <label>
                            Delivery Slot
                            <select>
                                <option>Morning — 8 AM to 12 PM</option>
                                <option>Afternoon — 1 PM to 5 PM</option>
                            </select>
                        </label>

                        <button
                            type="submit"
                            className="green-button full"
                        >
                            Continue to Payment
                        </button>

                        {saved && (
                            <p className="form-success full">
                                Address saved. Payment selection is ready.
                            </p>
                        )}
                    </form>

                    <Summary items={cart} />
                </div>
            </main>
        </PageLayout>
    );
}

export function Profile() {
    const orders = [
        ["#ORD1234", "May 20, 2026", "₹2,617", "Delivered"],
        ["#ORD1233", "May 15, 2026", "₹1,799", "Shipped"],
        ["#ORD1232", "May 10, 2026", "₹999", "Delivered"],
    ];

    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="My Account"
                    title="Welcome back, Rahul"
                    text="Here’s what’s happening with your orders."
                />

                <div className="account-layout">
                    <aside className="account-nav">
                        <b>My Account</b>

                        <a href="#dashboard">Dashboard</a>
                        <a href="#orders">My Orders</a>
                        <a href="#saved">Wishlist</a>
                        <a href="#address">Addresses</a>
                        <a href="#profile">Profile Details</a>
                    </aside>

                    <section>
                        <div className="metric-grid">
                            {[
                                ["Total Orders", "12"],
                                ["Delivered", "10"],
                                ["Pending", "2"],
                                ["Loyalty Points", "450"],
                            ].map(([label, value]) => (
                                <article key={label}>
                                    <span>{label}</span>
                                    <b>{value}</b>
                                </article>
                            ))}
                        </div>

                        <section className="panel order-table">
                            <h2>
                                Recent Orders{" "}
                                <Link to="/orders">
                                    View All
                                </Link>
                            </h2>

                            {orders.map((order) => (
                                <div key={order[0]}>
                                    <b>{order[0]}</b>

                                    <span>{order[1]}</span>

                                    <span>{order[2]}</span>

                                    <small className="status">
                                        {order[3]}
                                    </small>
                                </div>
                            ))}
                        </section>
                    </section>
                </div>
            </main>
        </PageLayout>
    );
}

export function TrackOrder() {
    const [tracked, setTracked] = useState(false);

    const steps = [
        "Order Placed",
        "Packed with Care",
        "Shipped from Our Farm",
        "Out for Delivery",
        "Delivered",
    ];

    return (
        <PageLayout>
            <main className="screen narrow">
                <PageTitle
                    eyebrow="Order Updates"
                    title="Track Your Order"
                    text="Enter an order number to see its journey from our orchard."
                />

                <section className="panel track-panel">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setTracked(true);
                        }}
                    >
                        <label>
                            Order Number

                            <input
                                required
                                placeholder="ORD1234"
                            />
                        </label>

                        <button
                            className="green-button"
                            type="submit"
                        >
                            Track Order
                        </button>
                    </form>

                    {tracked && (
                        <ol className="timeline">
                            {steps.map((step, index) => (
                                <li
                                    key={step}
                                    className={index < 4 ? "complete" : ""}
                                >
                                    <b>{step}</b>

                                    <span>
                                        {index === 4
                                            ? "Expected Today, 5:00 PM"
                                            : "May 20, 2026"}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </section>

                <div className="help-card">
                    <FaHeadset />

                    <span>
                        <b>Need Help?</b>
                        <br />
                        +91 98765 43210
                        <br />
                        support@maviinamane.com
                    </span>
                </div>
            </main>
        </PageLayout>
    );
}

export function Wishlist() {
    const {
        wishlist,
        addToCart,
        toggleWishlist,
    } = useShop();

    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="Saved for Later"
                    title="Your Wishlist"
                />

                <div className="simple-product-grid">
                    {wishlist.length ? (
                        wishlist.map((p) => (
                            <article
                                key={p.id}
                                className="saved-card"
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                />

                                <h2>{p.name} Mangoes</h2>

                                <p>₹{p.price} / Kg</p>

                                <button
                                    className="green-button"
                                    onClick={() => addToCart(p)}
                                >
                                    Add to Cart
                                </button>

                                <button
                                    className="text-button"
                                    onClick={() => toggleWishlist(p)}
                                >
                                    Remove
                                </button>
                            </article>
                        ))
                    ) : (
                        <p className="empty-note">
                            No saved mangoes yet.{" "}
                            <Link to="/shop">
                                Explore the Shop
                            </Link>
                        </p>
                    )}
                </div>
            </main>
        </PageLayout>
    );
}

export function Orders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => { getMyOrders().then(setOrders).catch(() => setOrders([])); }, []);
    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="My Purchases"
                    title="Order History"
                />

                <section className="panel order-table">
                    {orders.map((order) => <div key={order.id || order.orderNumber}><b>#{order.orderNumber}</b><span>{order.items?.map(item => item.name).join(", ") || "Mango order"}</span><span>₹{order.total || 0}</span><small className="status">{order.status || "Pending"}</small></div>)}
                    {!orders.length && <p className="empty-note">Sign in to see your order history.</p>}
                </section>
            </main>
        </PageLayout>
    );
}

export function About() {
    const products = useCatalog();
    return (
        <PageLayout>
            <main className="screen">
                <section className="farm-hero">
                    <div>
                        <p>FROM OUR FARM</p>

                        <h1>
                            Our Farm. Our Pride.
                            <br />
                            <em>Your Health.</em>
                        </h1>

                        <span>
                            We believe in delivering nature’s best mangoes
                            grown with love, care, and traditional farming
                            methods.
                        </span>
                    </div>

                    <img
                        src={products[2]?.image}
                        alt="Fresh mangoes on the farm"
                    />
                </section>

                <div className="farm-stats">
                    {[
                        ["500+", "Happy Customers"],
                        ["50+", "Acres of Farms"],
                        ["1000+", "Orders Delivered"],
                        ["10+", "Years of Care"],
                    ].map(([number, label]) => (
                        <div key={label}>
                            <b>{number}</b>

                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                <h2 className="section-heading">
                    Our Farm Gallery
                </h2>

                <div className="gallery-row">
                    {products.slice(0, 5).filter(Boolean).map((p) => (
                        <img
                            key={p.id}
                            src={p.image}
                            alt={`${p.name} Mangoes`}
                        />
                    ))}
                </div>
            </main>
        </PageLayout>
    );
}

export function Contact() {
    const [sent, setSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="We're Here to Help"
                    title="Get in Touch"
                    text="Questions about an order or a variety? Send us a message."
                />

                <div className="two-column">
                    <section className="contact-details">
                        <p>
                            <FaPhoneAlt />
                            <b> +91 98765 43210</b>
                            <br />
                            Mon–Sat, 9 AM–6 PM
                        </p>

                        <p>
                            ✉ <b>support@maviinamane.com</b>
                            <br />
                            We reply within 24 hours.
                        </p>

                        <p>
                            <FaMapMarkerAlt />
                            123, Mango Street
                            <br />
                            Farm Area, Andhra Pradesh
                        </p>
                    </section>

                    <form
                        className="panel form-grid"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setBusy(true); setError("");
                            try { await submitContactMessage(Object.fromEntries(new FormData(e.currentTarget))); e.currentTarget.reset(); setSent(true); }
                            catch (err) { setError(err.message || "Unable to send your message."); }
                            finally { setBusy(false); }
                        }}
                    >
                        <label>
                            Your Name
                            <input name="name" required />
                        </label>

                        <label>
                            Email
                            <input
                                type="email"
                                name="email" required
                            />
                        </label>

                        <label className="full">
                            Message
                            <textarea name="message" required />
                        </label>

                        <button
                            type="submit"
                            className="green-button full"
                        >
                            {busy ? "Sending..." : "Send Message"}
                        </button>

                        {sent && (
                            <p className="form-success full">
                                Thanks! We&apos;ll be in touch shortly.
                            </p>
                        )}
                        {error && <p className="form-error full">{error}</p>}
                    </form>
                </div>
            </main>
        </PageLayout>
    );
}

export function Blog() {
    const products = useCatalog();
    const articles = [
        [
            "How to Choose the Perfect Mango",
            "A simple guide to ripeness, aroma, and sweetness.",
        ],
        [
            "Health Benefits of Mangoes",
            "A golden fruit full of natural goodness.",
        ],
        [
            "Mango Recipes to Try",
            "Fresh ways to enjoy the season.",
        ],
    ];

    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="Fresh from Our Orchard"
                    title="Our Blog"
                    text="Tips, stories, and everything mango."
                />

                <div className="blog-grid">
                    {articles.map(([title, text], index) => (
                        <article key={title}>
                            <img
                                src={products[index]?.image}
                                alt={title}
                            />

                            <div>
                                <h2>{title}</h2>

                                <p>{text}</p>

                                <a href="#read">
                                    Read More →
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </PageLayout>
    );
}

export function Faq() {
    const questions = [
        "How do you deliver mangoes?",
        "How long will it take to deliver my order?",
        "Do you use chemicals to ripen mangoes?",
        "Can I return or replace my order?",
        "How can I track my order?",
    ];

    const [open, setOpen] = useState(0);

    return (
        <PageLayout>
            <main className="screen narrow">
                <PageTitle
                    eyebrow="Helpful Answers"
                    title="Frequently Asked Questions"
                />

                <div className="faq-list">
                    {questions.map((question, index) => (
                        <article key={question}>
                            <button
                                onClick={() =>
                                    setOpen(open === index ? -1 : index)
                                }
                            >
                                {question}

                                <b>
                                    {open === index ? "−" : "+"}
                                </b>
                            </button>

                            {open === index && (
                                <p>
                                    We harvest carefully, pack securely,
                                    and keep you updated from order
                                    confirmation through delivery.
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            </main>
        </PageLayout>
    );
}

export function Shipping() {
    const products = useCatalog();
    return (
        <PageLayout>
            <main className="screen">
                <PageTitle
                    eyebrow="Delivery Made Simple"
                    title="Shipping Policy"
                    text="Everything you need to know about receiving your mangoes."
                />

                <section className="policy">
                    <div>
                        <h2>Domestic Shipping</h2>

                        <p>
                            Orders are processed within 24–48 hours
                            and shipped via trusted delivery partners.
                        </p>

                        <h3>Shipping Charges</h3>

                        <p>
                            Free shipping on orders above ₹1,000.
                            A small delivery fee may apply to other
                            orders.
                        </p>

                        <h3>Delivery Time</h3>

                        <p>
                            Most orders arrive within 2–5 business
                            days, depending on your location.
                        </p>
                    </div>

                    <img
                        src={products[0]?.image}
                        alt="Mangoes ready for delivery"
                    />
                </section>
            </main>
        </PageLayout>
    );
}
