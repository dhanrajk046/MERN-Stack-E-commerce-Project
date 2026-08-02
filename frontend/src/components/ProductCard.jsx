import { Link } from 'react-router-dom';
import '../styles/product.css';

const ProductCard = ({ product }) => {
  const productId = product._id ?? product.id;
  const imageUrl = product.imageUrl ?? product.image;

  return (
    <article className="product-card">
      <img src={imageUrl} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <Link to={`/product/${productId}`} className="view-details-button">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;

