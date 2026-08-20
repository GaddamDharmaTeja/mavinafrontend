import { useEffect, useState } from "react";
import { getAdminAnalytics } from "../services/productService";

export default function LiveDashboard({ data }) {
  const [analytics,setAnalytics]=useState(null);
  useEffect(()=>{getAdminAnalytics().then(setAnalytics).catch(()=>setAnalytics(null));},[]);
  const status=analytics?.statusCounts||{};
  const metrics=[["Products",data.dashboard?.products||0],["Orders",data.dashboard?.orders||0],["Paid revenue",`₹${analytics?.paidRevenue||0}`],["Open deliveries",data.dashboard?.openOrders||0],["Customers",data.dashboard?.customers||0]];
  return <><div className="stat-row">{metrics.map(([label,value])=><article key={label}><div><small>{label}</small><b>{value}</b><span>Live data</span></div></article>)}</div><div className="tables-row"><section className="dash-panel list-panel"><header><b>Order status</b></header><table><tbody>{Object.entries(status).map(([name,count])=><tr key={name}><td>{name}</td><td><b>{count}</b></td></tr>)}{!Object.keys(status).length&&<tr><td>No orders yet.</td></tr>}</tbody></table></section><section className="dash-panel list-panel"><header><b>Recent orders</b></header><table><tbody>{data.orders.slice(0,6).map(order=><tr key={order.id}><td><b>#{order.orderNumber}</b><small>{order.customerName}</small></td><td>₹{order.total}</td><td><span className={`status ${String(order.status).toLowerCase()}`}>{order.status}</span></td></tr>)}{!data.orders.length&&<tr><td>No orders yet.</td></tr>}</tbody></table></section></div></>;
}
