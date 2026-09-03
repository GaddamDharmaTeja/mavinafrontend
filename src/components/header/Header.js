import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiHeart, FiMenu, FiSearch, FiShoppingCart, FiUser, FiX, FiArrowRight } from "react-icons/fi";
import { FaLeaf, FaPhoneAlt, FaTruck } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./Header.css";
import logo from "../../assets/backgroundimages/logo.png";

const links = [["Home", "/"], ["Shop", "/shop"], ["Our Mangoes", "/mangoes"], ["Our Farms", "/farms"], ["About Us", "/about"], ["Contact", "/contact"]];

export default function Header({ cartCount = 0 }) {
  const [open, setOpen] = useState(false), [searchOpen, setSearchOpen] = useState(false), [query, setQuery] = useState(""), [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  useEffect(() => { const read = () => { try { setCustomer(JSON.parse(window.localStorage.getItem("customer") || "null")); } catch { setCustomer(null); } }; read(); window.addEventListener("storage", read); window.addEventListener("customer-auth-changed", read); return () => { window.removeEventListener("storage", read); window.removeEventListener("customer-auth-changed", read); }; }, []);
  const submitSearch = event => { event.preventDefault(); if (query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`); setSearchOpen(false); };
  return <>
    <div className="utility-bar"><div className="utility-inner"><span><FaLeaf /> 100% Natural &amp; Organic</span><span><FaTruck /> Farm fresh harvests</span><span>Delivered across Bangalore in 3–4 days</span><span className="utility-contact"><FaPhoneAlt /> Customer care&nbsp; +91 98765 43210</span></div></div>
    <header className="header"><div className="container"><Link className="logo" to="/" onClick={() => setOpen(false)}><img src={logo.src || logo} alt="Maviina Mane" className="logo-img" /></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <FiX /> : <FiMenu />}</button><nav className={open ? "nav-open" : ""}><ul className="nav-links">{links.map(([label, to]) => <li key={to}><NavLink to={to} onClick={() => setOpen(false)}>{label}</NavLink></li>)}</ul></nav><div className="header-icons"><button aria-label="Search" onClick={() => setSearchOpen(true)}><FiSearch /></button><NavLink to="/wishlist" aria-label="Wishlist"><FiHeart /></NavLink><NavLink to={customer ? "/profile" : "/login"} aria-label={customer ? "My account" : "Sign in"}><FiUser /></NavLink><NavLink className="cart-icon" to="/cart" aria-label="Cart"><FiShoppingCart />{cartCount > 0 && <b>{cartCount}</b>}</NavLink></div></div></header>
    {searchOpen && <div className="search-layer" role="dialog" aria-label="Search products"><form onSubmit={submitSearch}><FiSearch /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search mangoes, pickles and more" /><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><FiX /></button><button className="search-submit" type="submit">Search <FiArrowRight /></button></form></div>}
  </>;
}
