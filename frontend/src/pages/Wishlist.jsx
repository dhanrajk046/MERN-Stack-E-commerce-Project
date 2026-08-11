import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Wishlist = () => {
  const { user, wishlist, wishlistLoading } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="status-page" style={{ maxWidth: '500px', margin: '80px auto', padding: '40px' }}>
        <h2>My Wishlist</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>Please log in to view and manage your wishlist.</p>
        <Link to="/login" className="btn" style={{ display: 'inline-block', width: 'auto' }}>Log In Now</Link>
      </div>
    );
  }

  return (
    <div className="shop-container" style={{ minHeight: '60vh' }}>
      <h2>My Wishlist</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '30px' }}>
        Save your favorite items here to view or purchase them later.
      </p>

      {wishlistLoading ? (
        <p className="page-state">Loading your wishlist...</p>
      ) : !wishlist || wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p className="page-state" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Your wishlist is currently empty.</p>
          <Link to="/shop" className="btn" style={{ display: 'inline-block', width: 'auto' }}>Explore Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
