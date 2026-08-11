import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.list();
        setProducts(data.slice(0, 4)); // Featured products
      } catch (requestError) {
        setError('Featured products are unavailable right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2 style={{ marginTop: '40px' }}>Browse by Category</h2>
      <div className="category-grid">
        <Link to="/shop?category=Electronics" className="category-card">
          <div className="category-icon">⚡</div>
          <h3>Electronics</h3>
          <p>Smart gadgets & devices</p>
        </Link>
        <Link to="/shop?category=Fashion" className="category-card">
          <div className="category-icon">👕</div>
          <h3>Fashion</h3>
          <p>Trending styles & apparel</p>
        </Link>
        <Link to="/shop?category=Home & Kitchen" className="category-card">
          <div className="category-icon">🍳</div>
          <h3>Home & Kitchen</h3>
          <p>Comfort & quality kitchenware</p>
        </Link>
      </div>

      <h2 style={{ marginTop: '50px' }}>Featured Products</h2>
      {loading ? (
        <p className="page-state">Loading products...</p>
      ) : error ? (
        <p className="page-state page-state-error" role="alert">{error}</p>
      ) : products.length === 0 ? (
        <p className="page-state">No featured products are available yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      {!loading && products.length > 0 && (
        <div className="home-products-link">
          <Link to="/shop" className="btn">View all products</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
