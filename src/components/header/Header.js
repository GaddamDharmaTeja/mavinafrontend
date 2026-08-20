import { Link, NavLink } from "react-router-dom";
import { FiHeart, FiMenu, FiSearch, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { FaLeaf, FaPhoneAlt, FaTruck } from "react-icons/fa";
import { useState } from "react";
import "./Header.css";
import logo from "../../assets/backgroundimages/logo.png";
function Header({ 
    cartCount=0 
}) { 
    const [open,setOpen]=useState(false);
     return <><div className="utility-bar">
        <div className="utility-inner">
            <span><FaLeaf/> 100% Natural &amp; Organic</span>
            <span>Farm Fresh Mangoes</span>
            <span><FaTruck/> Delivered to Your Doorstep</span>
            <span className="utility-contact"><FaPhoneAlt/> Customer Support &nbsp; +91 98765 43210</span>
            </div>
            </div>
            <header className="header">
                <div className="container">
                    <Link className="logo" to="/">
                    <img src={logo.src || logo} alt="Maviina Mane" className="logo-img"/>
                    </Link>
                    <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<FiX/>:<FiMenu/>}
                    </button>
                    <nav className={open?"nav-open":""}>
                        <ul className="nav-links">
                            <li><NavLink to="/">Home</NavLink></li>
                            <li><NavLink to="/shop">Shop</NavLink></li>
                            <li><NavLink to="/mangoes">Our Mangoes</NavLink></li>
                            <li><NavLink to="/farms">Our Farms</NavLink></li>
                            <li><NavLink to="/about">About Us</NavLink></li>
                            <li><NavLink to="/contact">Contact</NavLink></li>
                            </ul>
                            </nav>
                            <div className="header-icons">
                                <button aria-label="Search"><FiSearch/></button>
                                <NavLink to="/wishlist" aria-label="Wishlist"><FiHeart/></NavLink>
                                <NavLink to="/login" aria-label="Account"><FiUser/></NavLink>
                                <NavLink className="cart-icon" to="/cart" aria-label="Cart"><FiShoppingCart/>{cartCount>0&&<b>{cartCount}</b>}</NavLink>
                                </div>
                                </div>
                                </header></>;
                                 }
export default Header;
