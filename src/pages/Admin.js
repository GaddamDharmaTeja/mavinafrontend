import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Admin.css";
import "./ModernOrchard.css";
import "./AdminHeader.css";
import "./AdminLoginMobile.css";
import ContentModule from "./AdminContentModule";
import LiveDashboard from "./LiveDashboard";
import { DeliveryZonesPanel, FarmsPanel, SellerApplicationsPanel } from "./OperationsPanels";
import { ContactMessagesPanel, ExportsPanel, NotificationsPanel, PaymentsPanel } from "./AdminTools";
import SettingsPanel from "./SettingsPanel";
import AdminDeliveryCharges from "./AdminDeliveryChargesRedesigned";
import {
  FiBell,
  FiBox,
  FiChevronDown,
  FiEdit2,
  FiDownload,
  FiGrid,
  FiImage,
  FiLogOut,
  FiMail,
  FiMenu,
  FiPackage,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiTag,
  FiTruck,
  FiUsers,
} from "react-icons/fi";
import {
  adminLogin,
  archiveAdminRecord,
  archiveAdminProduct,
  getAdminCategories,
  getAdminFarms,
  getDeliveryZones,
  getNotifications,
  getSellerApplications,
  getAdminCustomers,
  getAdminContent,
  getAdminDashboard,
  getAdminOrders,
  getAdminProducts,
  saveAdminCategory,
  saveAdminFarm,
  saveDeliveryZone,
  saveAdminContent,
  saveAdminProduct,
  updateAdminOrder,
  reviewSellerApplication,
  markNotificationRead,
  purgeAdminRecord,
  restoreAdminRecord,
  uploadAdminImage,
  assetUrl,
} from "../services/productService";

const navigation = [
  ["Dashboard", FiGrid],
  ["Products", FiShoppingBag],
  ["Categories", FiTag],
  ["Orders", FiPackage],
  ["Customers", FiUsers],
  ["Farms", FiImage],
  ["Seller Applications", FiBox],
  ["Delivery Zones", FiTruck],
  ["Delivery Charges", FiTruck],
  ["Notifications", FiBell],
  ["Contact Messages", FiMail],
  ["Exports", FiDownload],
  ["Payments", FiBox],
  ["Data & Storage", FiBox],
  ["Settings", FiSettings],
];

const blank = {
  name: "",
  variety: "",
  price: "",
  weight: "1 Kg",
  description: "",
  stockQuantity: 0,
  imageUrl: "",
  featured: false,
  active: true,
};

export function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const data = await adminLogin(email, password);
      localStorage.setItem("admin_session", "active");
      localStorage.setItem("admin_email", data.email);
      nav("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="admin-login-screen">
      <section className="login-promo">
        <div className="brand-mark">◆</div>
        <b>Maviina Mane</b>
        <small>Admin Panel</small>
        <div>
          <h1>
            Fresh mangoes from
            <br />
            our farm to your home
          </h1>
          <p>Manage every part of your store with one simple workspace.</p>
        </div>
      </section>

      <form className="login-card" onSubmit={submit}>
        <div className="login-symbol">◆</div>
        <h2>Maviina Mane</h2>
        <p>Admin Login</p>

        <label>
          Email
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <div className="remember">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span>Forgot password?</span>
        </div>

        {error && <b className="admin-error">{error}</b>}

        <button type="submit">Login</button>

        <button type="button" className="register-btn" onClick={() => nav("/admin/register")}>
          Create Account
        </button>

        <small>© 2026 Maviina Mane. All rights reserved.</small>
      </form>
    </main>
  );
}

export function AdminDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState("Dashboard");
  const [data, setData] = useState({
    products: [],
    categories: [],
    orders: [],
    customers: [],
    farms: [],
    applications: [],
    zones: [],
    dashboard: null,
  });
  const [editing, setEditing] = useState(null);
  const [content, setContent] = useState(null);
  const [notice, setNotice] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [headerNotifications, setHeaderNotifications] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const adminEmail = typeof window !== "undefined" ? (window.localStorage.getItem("admin_email") || "Administrator") : "Administrator";

  const load = useCallback(async () => {
    try {
      const [products, categories, orders, dashboard, customers, farms, applications, zones] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
        getAdminOrders(),
        getAdminDashboard(),
        getAdminCustomers(),
        getAdminFarms(),
        getSellerApplications(),
        getDeliveryZones(),
      ]);
      setData({ products, categories, orders, dashboard, customers, farms, applications, zones });
    } catch {
      localStorage.removeItem("admin_session");
      nav("/admin/login");
    }
  }, [nav]);

  useEffect(() => {
    if (!localStorage.getItem("admin_session")) nav("/admin/login");
    else load();
  }, [load, nav]);

  useEffect(() => {
    getNotifications(adminEmail)
      .then(setHeaderNotifications)
      .catch(() => setHeaderNotifications([]));
  }, [adminEmail]);

  // Memoized so its reference stays stable across renders. Without this, every
  // render creates a new function, which would retrigger the useEffect in any
  // child (e.g. SettingsPanel, AdminContentModule) that lists `open` as a
  // dependency, causing an infinite fetch loop.
  const openContent = useCallback(async (key) => {
    const item = await getAdminContent(key);
    setContent({ key, value: item.value || {} });
    return item;
  }, []);

  const body =
    tab === "Dashboard" ? (
      <LiveDashboard data={data} />
    ) : tab === "Products" ? (
      <Products
        products={data.products}
        farms={data.farms}
        editing={editing}
        setEditing={setEditing}
        save={async (e) => {
          e.preventDefault();
          await saveAdminProduct({
            ...editing,
            price: +editing.price,
            stockQuantity: +editing.stockQuantity,
          });
          setNotice("Product saved successfully.");
          setEditing(null);
          load();
        }}
        upload={async (e) => {
          try {
            const upload = await uploadAdminImage(e.target.files[0], "PRODUCT", editing?.id);
            setEditing({ ...editing, imageUrl: upload.url });
          } catch (err) {
            setNotice(err.message);
          }
        }}
        archive={async (id) => {
          await archiveAdminProduct(id);
          setNotice("Product archived.");
          load();
        }}
      />
    ) : tab === "Categories" ? (
      <Categories
        categories={data.categories}
        save={async (value) => {
          await saveAdminCategory(value);
          setNotice("Category saved successfully.");
          load();
        }}
      />
    ) : tab === "Orders" ? (
      <Orders
        orders={data.orders}
        update={async (number, value) => {
          await updateAdminOrder(number, value);
          setNotice("Order updated successfully.");
          load();
        }}
        archive={async (id) => { await archiveAdminRecord("orders", id); setNotice("Order archived."); load(); }}
        purge={async (id) => { await purgeAdminRecord("orders", id); setNotice("Order permanently deleted."); load(); }}
      />
    ) : tab === "Customers" ? (
      <Customers customers={data.customers} />
    ) : tab === "Data & Storage" ? (
      <DataStorage data={data} archive={async (collection, id) => { await archiveAdminRecord(collection, id); setNotice("Record archived."); load(); }} restore={async (collection, id) => { await restoreAdminRecord(collection, id); setNotice("Record restored."); load(); }} purge={async (collection, id) => { await purgeAdminRecord(collection, id); setNotice("Record permanently deleted."); load(); }} />
    ) : tab === "Farms" ? (
      <FarmsPanel
        farms={data.farms}
        upload={uploadAdminImage}
        save={async (farm) => {
          await saveAdminFarm(farm);
          setNotice("Farm saved.");
          load();
        }}
      />
    ) : tab === "Seller Applications" ? (
      <SellerApplicationsPanel
        applications={data.applications}
        review={async (id, value) => {
          await reviewSellerApplication(id, value);
          setNotice("Application reviewed.");
          load();
        }}
      />
    ) : tab === "Delivery Zones" ? (
      <DeliveryZonesPanel
        zones={data.zones}
        save={async (zone) => {
          await saveDeliveryZone(zone);
          setNotice("Delivery zone saved.");
          load();
        }}
      />
    ) : tab === "Delivery Charges" ? (
      <AdminDeliveryCharges onNotice={setNotice} />
    ) : tab === "Notifications" ? (
      <NotificationsPanel email={adminEmail} />
    ) : tab === "Contact Messages" ? (
      <ContactMessagesPanel />
    ) : tab === "Exports" ? (
      <ExportsPanel products={data.products} customers={data.customers} orders={data.orders} />
    ) : tab === "Payments" ? (
      <PaymentsPanel orders={data.orders} />
    ) : tab === "Settings" ? (
      <SettingsPanel
        open={openContent}
        upload={uploadAdminImage}
        save={async (key, value) => {
          await saveAdminContent(key, value);
          setNotice("Settings saved successfully.");
        }}
      />
    ) : (
      <ContentModule
        title={tab}
        open={openContent}
        save={async (key, value) => {
          await saveAdminContent(key, value);
          setNotice(`${tab} saved successfully.`);
        }}
      />
    );

  return (
    <main className={`admin-app ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileSidebarOpen ? "mobile-sidebar-open" : ""}`}>
      {mobileSidebarOpen && <button className="admin-sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} />}
      <aside className="admin-sidebar">
        <div className="side-brand">
          <i>◆</i>
          <div>
            <b>Maviina Mane</b>
            <small>Admin Panel</small>
          </div>
        </div>

        <nav>
          {navigation.map(([name, Icon]) => (
            <button
              className={tab === name ? "selected" : ""}
              onClick={() => {
                setTab(name);
                setEditing(null);
                setMobileSidebarOpen(false);
              }}
              key={name}
            >
              <Icon />
              {name}
            </button>
          ))}
        </nav>

        <button
          className="signout"
          onClick={() => {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_session");
            localStorage.removeItem("admin_email");
            window.dispatchEvent(new Event("admin-auth-changed"));
            setMobileSidebarOpen(false);
            nav("/admin/login");
          }}
        >
          <FiLogOut />
          Logout
        </button>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => window.matchMedia("(max-width: 720px)").matches ? setMobileSidebarOpen(true) : setSidebarCollapsed((value) => !value)} aria-label="Toggle navigation">
            <FiMenu />
          </button>
          <div>
            <h1>{tab}</h1>
            <small>{tab === "Dashboard" ? "Welcome back, Admin! 👋" : `Dashboard / ${tab}`}</small>
          </div>
          <label className="global-search">
            <FiSearch />
            <input placeholder="Search anything..." />
          </label>
          <div className="top-actions">
            <button className="header-icon-button" onClick={() => setNotificationsOpen((open) => !open)} aria-label="Open notifications">
              <FiBell />
              {headerNotifications.filter((item) => !item.read).length > 0 && (
                <b>{headerNotifications.filter((item) => !item.read).length}</b>
              )}
            </button>

            <button className="header-icon-button" onClick={() => setTab("Notifications")} aria-label="Open notification inbox">
              <FiMail />
            </button>

            <div className="account-control">
              <button className="account-trigger" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen}>
                <div className="avatar">{adminEmail.charAt(0).toUpperCase()}</div>
                <span>
                  <b>{adminEmail}</b>
                  <small>Administrator</small>
                </span>
                <FiChevronDown />
              </button>

              {accountOpen && (
                <div className="admin-account-menu">
                  <button
                    onClick={() => {
                      localStorage.removeItem("admin_token");
                      localStorage.removeItem("admin_email");
                      nav("/admin/login");
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>

            {notificationsOpen && (
              <div className="notification-drawer">
                <header>
                  <b>Notifications</b>
                  <button onClick={() => setNotificationsOpen(false)}>×</button>
                </header>

                {headerNotifications.length ? (
                  headerNotifications.slice(0, 5).map((item) => (
                    <button
                      className={item.read ? "read" : ""}
                      key={item.id}
                      onClick={async () => {
                        if (!item.read) {
                          await markNotificationRead(item.id);
                          setHeaderNotifications(
                            headerNotifications.map((value) => (value.id === item.id ? { ...value, read: true } : value))
                          );
                        }
                      }}
                    >
                      <b>{item.title}</b>
                      <small>{item.message}</small>
                    </button>
                  ))
                ) : (
                  <p>No new notifications.</p>
                )}
              </div>
            )}
          </div>
        </header>

        {notice && (
          <p className="admin-flash">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </p>
        )}

        <div className="admin-page">{body}</div>
      </section>
    </main>
  );
}

function DashboardView({ data }) {
  const metrics = [
    ["Total Mangoes", data.dashboard?.products || 0, "🍊"],
    ["Orders Today", data.dashboard?.orders || 0, "▣"],
    ["Today's Revenue", `₹${data.dashboard?.revenue || 0}`, "₹"],
    ["Pending Deliveries", data.dashboard?.openOrders || 0, "▱"],
    ["Total Customers", "2,341", "♧"],
  ];

  return (
    <>
      <div className="stat-row">
        {metrics.map(([label, value, icon]) => (
          <article key={label}>
            <i>{icon}</i>
            <div>
              <small>{label}</small>
              <b>{value}</b>
              <span>
                ↑ 12.5% <em>vs last month</em>
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="analytics-row">
        <Panel title="Sales Overview" filter="This Week">
          <div className="line-chart">
            <span>₹120K</span>
            <span>₹90K</span>
            <span>₹60K</span>
            <span>₹30K</span>
            <svg viewBox="0 0 600 180" preserveAspectRatio="none">
              <path d="M0,150 C60,130 70,100 110,115 S170,80 205,97 S260,40 310,66 S365,70 415,42 S470,94 510,60 S560,28 600,20" />
              <path
                className="area"
                d="M0,150 C60,130 70,100 110,115 S170,80 205,97 S260,40 310,66 S365,70 415,42 S470,94 510,60 S560,28 600,20 L600,180 L0,180Z"
              />
            </svg>
            <div className="chart-days">
              <b>25 Apr</b>
              <b>26 Apr</b>
              <b>27 Apr</b>
              <b>28 Apr</b>
              <b>29 Apr</b>
              <b>30 Apr</b>
              <b>01 May</b>
            </div>
          </div>
        </Panel>

        <Panel title="Revenue Overview" filter="This Month">
          <div className="bar-chart">
            {[58, 90, 40, 74, 61].map((height, index) => (
              <div key={height}>
                <i style={{ height: `${height}%` }} />
                <span>Week {index + 1}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Orders Overview" filter="This Month">
          <div className="donut">
            <div>
              <b>{data.orders.length || 0}</b>
              <small>Total Orders</small>
            </div>
          </div>
          <ul className="legend">
            <li>
              Delivered <b>98 (62.8%)</b>
            </li>
            <li>
              Processing <b>32 (20.8%)</b>
            </li>
            <li>
              Shipped <b>16 (10.3%)</b>
            </li>
            <li>
              Pending <b>10 (6.4%)</b>
            </li>
          </ul>
        </Panel>
      </div>

      <div className="tables-row">
        <TopProducts products={data.products} />
        <RecentOrders orders={data.orders} />
      </div>
    </>
  );
}

const Panel = ({ title, filter, children }) => (
  <section className="dash-panel">
    <header>
      <b>{title}</b>
      <button>{filter}⌄</button>
    </header>
    {children}
  </section>
);

function TopProducts({ products }) {
  return (
    <section className="dash-panel list-panel">
      <header>
        <b>Top Selling Mangoes</b>
        <button>View All</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Mango variety</th>
            <th>Sold</th>
            <th>Revenue</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.slice(0, 4).map((p, index) => (
            <tr key={p.id}>
              <td>
                <i className="mango-dot">🥭</i>
                {p.name}
              </td>
              <td>{245 - index * 36}</td>
              <td>₹{(p.price * (245 - index * 36)).toLocaleString()}</td>
              <td>
                <span className="stock-pill">{p.stockQuantity}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function RecentOrders({ orders }) {
  return (
    <section className="dash-panel list-panel">
      <header>
        <b>Recent Orders</b>
        <button>View All</button>
      </header>
      <table>
        <tbody>
          {orders.slice(0, 5).map((order) => (
            <tr key={order.id}>
              <td>
                <i className="mango-dot">🥭</i>
              </td>
              <td>
                <b>#{order.orderNumber}</b>
                <small>{order.customerName}</small>
              </td>
              <td>₹{order.total}</td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function Products({ products, farms, editing, setEditing, save, upload, archive }) {
  return (
    <>
      <div className="page-tools">
        <label>
          <FiSearch />
          <input placeholder="Search products..." />
        </label>
        <button>⌄ All Categories</button>
        <button className="green" onClick={() => setEditing({ ...blank })}>
          <FiPlus /> Add Product
        </button>
      </div>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Variety</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className="product-cell">
                  {p.imageUrl ? <img src={assetUrl(p.imageUrl)} alt="" /> : <i>🥭</i>}
                  <b>{p.name}</b>
                </td>
                <td>{p.variety}</td>
                <td>₹{p.price}</td>
                <td>{p.stockQuantity}</td>
                <td>
                  <span className={p.active ? "active-tag" : "inactive-tag"}>{p.active ? "Active" : "Inactive"}</span>
                </td>
                <td>
                  <button className="icon-btn" onClick={() => setEditing(p)}>
                    <FiEdit2 />
                  </button>
                  <button className="delete-btn" onClick={() => archive(p.id)}>
                    ⌫
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editing && <ProductForm item={editing} farms={farms} setItem={setEditing} save={save} upload={upload} />}
    </>
  );
}

function ProductForm({ item, farms, setItem, save, upload }) {
  return (
    <div className="modal-wrap">
      <form className="product-form" onSubmit={save}>
        <header>
          <div>
            <small>Dashboard / Products / {item.id ? "Edit Product" : "Add Product"}</small>
            <h2>{item.id ? "Edit Product" : "Add Product"}</h2>
          </div>
          <button type="button" onClick={() => setItem(null)}>
            ×
          </button>
        </header>

        <div className="form-columns">
          <section>
            <h3>Product Information</h3>
            <div className="field-grid">
              {[
                ["name", "Product Name"],
                ["variety", "Category / Variety"],
                ["price", "Price (₹)"],
                ["weight", "Weight"],
                ["stockQuantity", "Stock"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type={key === "price" || key === "stockQuantity" ? "number" : "text"}
                    placeholder={label}
                    value={item[key] ?? ""}
                    onChange={(e) => setItem({ ...item, [key]: e.target.value })}
                    required
                  />
                </label>
              ))}

              <label>
                Farm owner
                <select value={item.farmId || ""} onChange={(e) => setItem({ ...item, farmId: e.target.value })}>
                  <option value="">Central orchard / unassigned</option>
                  {farms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Short Description
              <textarea
                placeholder="Brief about the product..."
                value={item.description || ""}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
              />
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(e) => setItem({ ...item, featured: e.target.checked })}
              />
              <i /> Featured Product
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={item.available !== false}
                onChange={(e) => setItem({ ...item, available: e.target.checked })}
              />
              <i /> Available for purchase
            </label>
          </section>

          <section>
            <h3>Product Images</h3>
            <label className="upload-box">
              <FiImage />
              <b>Click to upload or drag and drop</b>
              <small>PNG, JPG, JPEG up to 5 MB</small>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} />
            </label>

            {item.imageUrl && <img className="upload-preview" src={assetUrl(item.imageUrl)} alt="Preview" />}

            <label className="toggle">
              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => setItem({ ...item, active: e.target.checked })}
              />
              <i /> Active
            </label>
          </section>
        </div>

        <footer>
          <button type="button" onClick={() => setItem(null)}>
            Cancel
          </button>
          <button className="green">Save Product</button>
        </footer>
      </form>
    </div>
  );
}

function Categories({ categories, save }) {
  const [item, setItem] = useState({
    name: "",
    slug: "",
    description: "",
    active: true,
  });

  return (
    <div className="split-page">
      <section className="admin-table-card">
        <div className="card-title">
          <b>Categories</b>
          <span>{categories.length} total</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Category name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  <b>🥭 &nbsp;{c.name}</b>
                </td>
                <td>{c.description}</td>
                <td>
                  <span className="active-tag">{c.active ? "Active" : "Inactive"}</span>
                </td>
                <td>
                  <button className="icon-btn">
                    <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <form
        className="side-form"
        onSubmit={async (e) => {
          e.preventDefault();
          await save(item);
          setItem({ name: "", slug: "", description: "", active: true });
        }}
      >
        <h2>Add Category</h2>

        <label>
          Category Name
          <input
            value={item.name}
            onChange={(e) =>
              setItem({
                ...item,
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
              })
            }
            required
          />
        </label>

        <label>
          Slug
          <input value={item.slug} onChange={(e) => setItem({ ...item, slug: e.target.value })} required />
        </label>

        <label>
          Description
          <textarea value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} />
        </label>

        <button className="green">Save Category</button>
      </form>
    </div>
  );
}

function Orders({ orders, update, archive, purge }) {
  return (
    <>
      <div className="page-tools">
        <label>
          <FiSearch />
          <input placeholder="Search orders..." />
        </label>
        <button>▣ 01 May 2026 - 31 May 2026</button>
        <button className="green">⇩ Export</button>
      </div>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Tracking</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>
                  <b>#{o.orderNumber}</b>
                </td>
                <td>
                  {o.customerName}
                  <small>{o.phone}</small>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>₹{o.total}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      update(o.orderNumber, {
                        status: e.target.value,
                        courier: o.courier || "",
                        trackingNumber: o.trackingNumber || "",
                      })
                    }
                  >
                    {["PENDING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`status ${o.paymentStatus?.toLowerCase()}`}>{o.paymentStatus}</span>
                </td>
                <td>
                  <input
                    placeholder="Tracking number"
                    defaultValue={o.trackingNumber || ""}
                    onBlur={(e) =>
                      update(o.orderNumber, {
                        courier: o.courier || "",
                        trackingNumber: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <button className="delete-btn" onClick={() => archive(o.id)}>Archive</button>
                  {o.archived && <button className="icon-btn" onClick={() => { if (window.confirm("Permanently delete this archived order?")) purge(o.id); }}>Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function Settings({ content, setContent, open, save }) {
  return (
    <div className="settings-layout">
      <section className="settings-tabs">
        {["settings", "home", "farm", "footer", "contact", "shipping"].map((key) => (
          <button onClick={() => open(key)} className={content?.key === key ? "selected" : ""} key={key}>
            {key === "settings" ? "General Settings" : `${key[0].toUpperCase()}${key.slice(1)} Settings`}
          </button>
        ))}
      </section>

      <form className="settings-card" onSubmit={save}>
        {content ? (
          <>
            <header>
              <h2>{content.key === "settings" ? "General Settings" : `${content.key} Content`}</h2>
              <p>Update the details shown to your customers.</p>
            </header>

            <label>
              Content settings (JSON)
              <textarea
                value={JSON.stringify(content.value, null, 2)}
                onChange={(e) => {
                  try {
                    setContent({ ...content, value: JSON.parse(e.target.value) });
                  } catch {
                    // ignore invalid JSON until it parses again
                  }
                }}
              />
            </label>

            <p className="helper">Use valid JSON, e.g. {`{"name":"Maviina Mane"}`}.</p>
            <button className="green">Save Changes</button>
          </>
        ) : (
          <p>Select a setting group to start editing.</p>
        )}
      </form>
    </div>
  );
}

function DataStorage({ data, archive, restore, purge }) {
  const [query, setQuery] = useState("");
  const collections = [["products", "Products", data.products], ["categories", "Categories", data.categories], ["farms", "Farms", data.farms], ["orders", "Orders", data.orders], ["users", "Customers", data.customers]];
  const records = collections.flatMap(([collection, label, items]) => items.map(item => ({ collection, label, item }))).filter(({ item, label }) => `${label} ${item.name || item.orderNumber || ""} ${item.email || ""}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="page-tools"><label><FiSearch/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find any saved record..." /></label><b>{records.length} records</b></div><section className="admin-table-card"><div className="card-title"><b>Data &amp; storage</b><span>Archive first; permanently delete only archived records.</span></div><table><thead><tr><th>Type</th><th>Record</th><th>Status</th><th>Actions</th></tr></thead><tbody>{records.map(({ collection, label, item }) => <tr key={`${collection}-${item.id}`}><td>{label}</td><td><b>{item.name || item.orderNumber || item.email}</b><small>{item.email || item.description || item.createdAt}</small></td><td><span className={item.archived ? "inactive-tag" : "active-tag"}>{item.archived ? "Archived" : "Active"}</span></td><td>{item.archived ? <><button className="icon-btn" onClick={() => restore(collection, item.id)}>Restore</button><button className="delete-btn" onClick={() => { if (window.confirm("Permanently delete this archived record?")) purge(collection, item.id); }}>Delete</button></> : <button className="delete-btn" onClick={() => archive(collection, item.id)}>Archive</button>}</td></tr>)}{!records.length && <tr><td colSpan="4">No matching records.</td></tr>}</tbody></table></section></>;
}

function Customers({ customers }) {
  const [query, setQuery] = useState("");
  const visible = customers.filter((customer) =>
    `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="page-tools">
        <label>
          <FiSearch />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customers..." />
        </label>
        <b>{visible.length} customers</b>
      </div>

      <section className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <b>{customer.name}</b>
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone || "—"}</td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan="3">No customer accounts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

const Placeholder = ({ title, configure }) => (
  <section className="empty-admin">
    <i>◆</i>
    <h2>{title}</h2>
    <p>This management module is ready for your next store workflow.</p>
    <button className="green" onClick={configure}>
      Configure {title}
    </button>
  </section>
);

