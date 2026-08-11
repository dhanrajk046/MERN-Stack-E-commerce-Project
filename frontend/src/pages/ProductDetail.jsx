import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { AuthContext } from '../context/AuthContext';
import { productsApi } from '../services/api';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1,
        stock: product.stock,
      }));
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setReviewSubmitLoading(true);
    setReviewError('');
    try {
      await productsApi.createReview(id, rating, comment);
      // Fetch updated product to display review list & AI summary immediately
      const updatedRes = await fetch(`/api/products/${id}`);
      const updatedData = await updatedRes.json();
      setProduct(updatedData);
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link> / <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link> / {product.category} / <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Left Side: Image */}
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        {/* Right Side: Information Block */}
        <div className="detail-info">
          
          <h2 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>{product.name}</h2>

          <p className="detail-price" style={{ fontSize: '2.5rem', margin: '15px 0' }}>₹{product.price.toFixed(2)}</p>

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Product Description</h4>
            <p style={{ color: '#a1a1aa', lineHeight: '1.8' }}>{product.description}</p>
          </div>

          {/* Cart & Stock Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={handleAddToCart} className="btn" disabled={product.stock < 1} style={{ flexGrow: '1', padding: '18px', fontSize: '1.2rem' }}>
              {product.stock > 0 ? 'Add to Shopping Cart' : 'Out of Stock'}
            </button>
          </div>
          
          <p style={{ marginTop: '20px', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>

      {/* AI Digest Section */}
      {product.aiSummary && (
        <div className="ai-digest-card">
          <div className="ai-digest-header">
            <span className="ai-digest-badge">Grok AI Summary</span>
            <h3 className="ai-digest-title">ShopNest AI Review Digest</h3>
          </div>
          <p className="ai-digest-summary">{product.aiSummary}</p>
          <div className="ai-sentiment-container">
            <div className="ai-sentiment-metric">
              <span className="ai-sentiment-label">Customer Sentiment</span>
              <span className="ai-sentiment-value">{product.aiSentiment || "Positive"}</span>
            </div>
            <div className="ai-sentiment-metric">
              <span className="ai-sentiment-label">AI Trust Rating</span>
              <span className="ai-sentiment-value">{product.aiTrustScore || 0}% positive response</span>
            </div>
            <div className="ai-progress-bar-wrapper">
              <div className="ai-progress-bar-bg">
                <div className="ai-progress-bar-fill" style={{ width: `${product.aiTrustScore || 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        <p style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
          Average rating: {product.rating ? `${product.rating.toFixed(1)} ★` : 'No ratings yet'} ({product.numReviews || 0} reviews)
        </p>
        
        <div className="reviews-grid">
          {/* Reviews List */}
          <div className="review-list">
            {!product.reviews || product.reviews.length === 0 ? (
              <p style={{ color: '#a1a1aa', fontStyle: 'italic' }}>
                No reviews have been written for this product yet. Be the first to write a review!
              </p>
            ) : (
              [...product.reviews].reverse().map((review) => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">{review.name}</span>
                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="review-stars">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Card */}
          <div className="review-form-card">
            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <h3>Write a Review</h3>
                {reviewError && <p style={{ color: '#ef4444', marginBottom: '10px', fontSize: '0.9rem' }}>{reviewError}</p>}
                
                <div className="rating-select-group">
                  <label>Your Rating</label>
                  <div className="rating-stars-input">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className={`star-input-btn ${rating >= val ? 'active' : ''}`}
                        onClick={() => setRating(val)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="comment-textarea-group">
                  <label>Your Review</label>
                  <textarea
                    required
                    placeholder="Tell us what you liked or disliked about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn review-submit-btn" disabled={reviewSubmitLoading}>
                  {reviewSubmitLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <h3>Write a Review</h3>
                <p style={{ color: '#a1a1aa', marginBottom: '20px' }}>You must be logged in to share your review.</p>
                <Link to="/login" className="btn" style={{ display: 'block' }}>Log In Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
