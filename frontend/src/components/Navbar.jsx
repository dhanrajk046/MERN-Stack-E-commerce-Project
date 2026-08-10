import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from "react-redux";
import "../styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartQuantity = cartItems.reduce((total, item) => total + item.qty, 0);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handlelogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-brand">
        <Link to="/">
          <img src="/logo.jpg" alt="ShopNest Logo" className="navbar-logo" />
          ShopNest
        </Link>
      </div>
      <button
        type="button"
        className="navbar-menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="main-navigation-links"
        onClick={() => setMenuOpen((isOpen) => !isOpen)}
      >
        <span />
        <span />
        <span />
      </button>
      <ul id="main-navigation-links" className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cartQuantity})</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profile">Hi, {user.name}</Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button onClick={handlelogout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
