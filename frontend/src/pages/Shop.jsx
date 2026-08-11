import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../services/api';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');
  const [error, setError] = useState('');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

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

  // Sync category state with search parameters
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(submittedSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  };

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      
      <div className="shop-controls">
        {/* Category Tabs */}
        <div className="category-tabs">
          {['All', 'Electronics', 'Fashion', 'Home & Kitchen'].map(cat => (
            <button
              key={cat}
              type="button"
              className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
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
      </div>

      {loading ? (
        <p className="page-state">Loading products...</p>
      ) : error ? (
        <p className="page-state page-state-error" role="alert">{error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="page-state">No products found in this category.</p>
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
