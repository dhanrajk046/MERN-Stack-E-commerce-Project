import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2026 ShopNest. All rights reserved</p>
        <ul className="footer-links">
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>
        </ul>
      </div>
    </footer>
  );
}


export default Footer;
