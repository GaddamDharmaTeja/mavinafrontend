import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX,
  FiArrowRight,
} from "react-icons/fi";
import { FaLeaf, FaPhoneAlt, FaTruck } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./Header.css";
import logo from "../../assets/backgroundimages/logo.png";

const links = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Our Mangoes", "/mangoes"],
  ["Our Farms", "/farms"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
];

export default function Header({ cartCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customer, setCustomer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const read = () => {
      try {
        const savedCustomer = window.localStorage.getItem("customer");

        setCustomer(
          savedCustomer ? JSON.parse(savedCustomer) : null
        );
      } catch {
        setCustomer(null);
      }
    };

    read();

    window.addEventListener("storage", read);
    window.addEventListener("customer-auth-changed", read);

    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("customer-auth-changed", read);
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  const submitSearch = (event) => {
    event.preventDefault();

    const searchValue = query.trim();

    if (searchValue) {
      navigate(
        `/shop?search=${encodeURIComponent(searchValue)}`
      );
    }

    setSearchOpen(false);
  };

  return (
    <>
      {/* =====================================================
          UTILITY BAR
      ===================================================== */}

      <div className="utility-bar">
        <div className="utility-inner">

          <span>
            <FaLeaf />
            100% Natural &amp; Organic
          </span>

          <span className="delivery-item">
            <FaTruck className="moving-truck" />
            Farm fresh harvests
          </span>

          <span>
            Delivered across Bangalore in 3–4 days
          </span>

          <span className="utility-contact">
            <FaPhoneAlt />
            Customer care&nbsp; +91 98765 43210
          </span>

        </div>
      </div>


      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header className="header">

        <div className="container">

          {/* LOGO */}

          <Link
            className="logo"
            to="/"
            onClick={closeMenu}
          >
            <img
              src={logo.src || logo}
              alt="Maviina Mane"
              className="logo-img"
            />
          </Link>


          {/* DESKTOP / MOBILE NAV */}

          <nav
            className={open ? "nav-open" : ""}
            aria-label="Main navigation"
          >
            <ul className="nav-links">

              {links.map(([label, to]) => (
                <li key={to}>

                  <NavLink
                    to={to}
                    onClick={closeMenu}
                  >
                    {label}
                  </NavLink>

                </li>
              ))}

            </ul>
          </nav>


          {/* HEADER ICONS */}

          <div className="header-icons">

            {/* SEARCH */}

            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setSearchOpen(true);
                setOpen(false);
              }}
            >
              <FiSearch />
            </button>


            {/* WISHLIST */}

            <NavLink
              to="/wishlist"
              aria-label="Wishlist"
              onClick={closeMenu}
            >
              <FiHeart />
            </NavLink>


            {/* ACCOUNT */}

            <NavLink
              to={customer ? "/profile" : "/login"}
              aria-label={
                customer
                  ? "My account"
                  : "Sign in"
              }
              onClick={closeMenu}
            >
              <FiUser />
            </NavLink>


            {/* CART */}

            <NavLink
              className="cart-icon"
              to="/cart"
              aria-label="Cart"
              onClick={closeMenu}
            >
              <FiShoppingCart />

              {cartCount > 0 && (
                <b>{cartCount}</b>
              )}
            </NavLink>

          </div>


          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>

        </div>

      </header>


      {/* =====================================================
          SEARCH OVERLAY
      ===================================================== */}

      {searchOpen && (
        <div
          className="search-layer"
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >

          <form onSubmit={submitSearch}>

            <FiSearch />

            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mangoes, pickles and more"
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <FiX />
            </button>

            <button
              className="search-submit"
              type="submit"
            >
              Search
              <FiArrowRight />
            </button>

          </form>

        </div>
      )}
    </>
  );
}