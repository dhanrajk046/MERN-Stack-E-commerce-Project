import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <div>
          <h3 style={{ color: "#f97316", marginBottom: "10px" }}>ShopNest</h3>
          <p style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            Premium E-Commerce Platform.
          </p>
        </div>

        <div className="site-footer-links">
          <Link to="/about" style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            About Us
          </Link>
          <Link to="/return" style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
            Return Policy
          </Link>
          <Link
            to="/disclaimer"
            style={{ color: "#a1a1aa", fontSize: "0.9rem" }}
          >
            Disclaimer
          </Link>
        </div>

        <div style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
