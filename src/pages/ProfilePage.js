import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { getMyOrders } from "../services/productService";
import "./CommercePages.css";

export default function ProfilePage() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true);
  const customer = JSON.parse(localStorage.getItem("customer") || "null");
  useEffect(() => { getMyOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false)); }, []);
  const delivered = orders.filter(order => order.status === "DELIVERED").length;
  const inProgress = orders.filter(order => !["DELIVERED", "CANCELLED"].includes(order.status)).length;
  if (!customer) return <PageLayout><main className="screen narrow"><section className="panel account-empty"><h1>Your account</h1><p>Sign in to see your orders and delivery updates.</p><Link className="green-button" to="/login">Sign in</Link></section></main></PageLayout>;
  return <PageLayout><main className="screen account-screen"><header className="page-title"><p>MY ORCHARD ACCOUNT</p><h1>Welcome back, {customer.name?.split(" ")[0] || "there"}.</h1><span>Your orders, deliveries and seasonal favourites in one place.</span></header><div className="account-layout"><aside className="account-nav"><b>My Account</b><Link to="/profile">Dashboard</Link><Link to="/orders">My Orders</Link><Link to="/track-order">Track an order</Link><Link to="/shop">Shop mangoes</Link></aside><section><div className="metric-grid"><article><span>Total orders</span><b>{orders.length}</b></article><article><span>Delivered</span><b>{delivered}</b></article><article><span>On the way</span><b>{inProgress}</b></article><article><span>Orchard points</span><b>{delivered * 50}</b></article></div><section className="panel order-table"><h2>Recent orders <Link to="/orders">View all</Link></h2>{loading?<p>Loading your orders…</p>:orders.length?orders.slice(0,5).map(order=><div key={order.id}><b>#{order.orderNumber}</b><span>{new Date(order.createdAt).toLocaleDateString()}</span><span>₹{order.total}</span><small className="status">{order.status}</small></div>):<div className="account-empty"><b>Your orchard basket is waiting.</b><span>Place an order and delivery updates will appear right here.</span><Link to="/shop">Shop seasonal mangoes →</Link></div>}</section></section></div></main></PageLayout>;
}
