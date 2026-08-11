import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/product.css";

const ProductCard = ({ product }) => {
  const { user, wishlist, toggleWishlist } = useContext(AuthContext);
  const navigate = useNavigate();

  const isWishlisted = user && wishlist && wishlist.some(item => {
    const id = typeof item === 'object' && item !== null ? item._id : item;
    return id === product._id;
  });

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    toggleWishlist(product._id);
  };

  return (
    <div className="product-card">
      <button 
        type="button"
        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
        onClick={handleWishlistClick}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>
      <img
        src={product.imageUrl || product.image || "/logo.jpg"}
        alt={product.name}
        className="product-image"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = "/logo.jpg";
        }}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>
        <Link to={`/product/${product._id}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
