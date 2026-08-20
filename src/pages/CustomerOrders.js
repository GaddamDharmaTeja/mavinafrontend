import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { getMyOrders } from "../services/productService";
import "./CommercePages.css";
import "./CustomerOrders.css";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]); const [state, setState] = useState("loading");
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  useEffect(() => { if (!customer) return; getMyOrders().then(items => { setOrders(items); setState("ready"); }).catch(() => setState("error")); }, [customer]);
  if (!customer) return <Navigate to="/login" replace />;
  return <PageLayout><main className="screen orders-page">
    <header className="page-title"><p>MY ORCHARD ACCOUNT</p><h1>Your mango orders</h1><span>Every order, delivery update, and tracking detail in one place.</span></header>
    {state === "loading" && <section className="orders-state panel">Loading your orchard orders…</section>}
    {state === "error" && <section className="orders-state panel"><h2>We couldn’t load your orders</h2><p>Your account is still safe. Please refresh and try again.</p><button className="green-button" onClick={() => window.location.reload()}>Try again</button></section>}
    {state === "ready" && !orders.length && <section className="orders-state panel"><h2>Your first box is waiting</h2><p>Once you order, its packing and delivery updates will appear here.</p><Link className="green-button" to="/shop">Explore mangoes</Link></section>}
    {state === "ready" && orders.length > 0 && <div className="customer-order-list">{orders.map(order => { const events = Array.isArray(order.timeline) ? order.timeline.slice(-3) : []; return <article className="customer-order-card" key={order.id || order.orderNumber}>
      <header><div><small>ORDER #{order.orderNumber}</small><h2>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</h2></div><span className={`status ${String(order.status || "PENDING").toLowerCase()}`}>{order.status || "PENDING"}</span></header>
      <div className="customer-order-items">{(order.items || []).map((item, index) => <p key={`${item.productId || item.name}-${index}`}><span>{item.name} <small>× {item.quantity}</small></span><b>₹{Number(item.price || 0) * Number(item.quantity || 1)}</b></p>)}</div>
      <footer><div><small>{order.trackingNumber ? `${order.courier || "Courier"}: ${order.trackingNumber}` : "Tracking will appear when your box ships."}</small><strong>₹{order.total}</strong></div><Link to={`/track-order?order=${encodeURIComponent(order.orderNumber)}`}>Track order →</Link></footer>
      {events.length > 0 && <ol className="customer-order-timeline">{events.map((event, index) => <li key={`${event.status}-${index}`} className={index === events.length - 1 ? "current" : ""}><b>{event.status}</b><span>{event.note || "Order update"}</span></li>)}</ol>}
    </article>; })}</div>}
  </main></PageLayout>;
}
