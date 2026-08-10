import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../services/api';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.list();
        setProducts(data);
      } catch (requestError) {
        setError('Products are unavailable right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(submittedSearch.toLowerCase()));

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  };

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      <form className="product-search" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
          aria-label="Search products"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {loading ? (
        <p className="page-state">Loading products...</p>
      ) : error ? (
        <p className="page-state page-state-error" role="alert">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="page-state">No products match your search.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
