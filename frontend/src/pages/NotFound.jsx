import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="status-page">
    <h2>Page not found</h2>
    <p>The page you requested is unavailable or may have moved.</p>
    <Link className="btn" to="/shop">Browse products</Link>
  </div>
);

export default NotFound;
