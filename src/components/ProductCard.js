import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const calculateSavings = () => {
    if (product.originalPrice) {
      const savings = product.originalPrice - product.price;
      const savingsPercentage = Math.round((savings / product.originalPrice) * 100);
      return { savings, savingsPercentage };
    }
    return null;
  };

  const savings = calculateSavings();
  const isNewArrival = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <div 
      className="product-card"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-badges">
        {isNewArrival && <span className="new-badge">NEW</span>}
        {product.promotion && <span className="deal-badge">DEAL</span>}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="stock-badge">Only {product.stock} left!</span>
        )}
      </div>

      <div className="product-image-wrapper">
        <img 
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = '/placeholder-image.png';
            e.target.onerror = null;
          }}
        />
        {isHovered && (
          <div className="quick-view-overlay">
            <span>Quick View</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.rating && (
          <div className="product-rating">
            <div className="stars" style={{ '--rating': product.rating }}>★★★★★</div>
            <span className="rating-count">({product.ratingCount || 0})</span>
          </div>
        )}

        <div className="price-section">
          <div className="current-price">
            {formatPrice(product.price)}
          </div>
          {product.originalPrice && (
            <>
              <div className="original-price">
                Was {formatPrice(product.originalPrice)}
              </div>
              <div className="savings-tag">
                Save {savings.savingsPercentage}%
              </div>
            </>
          )}
        </div>

        {product.freeDelivery && (
          <div className="delivery-info">
            <i className="fas fa-truck"></i> Free Delivery
          </div>
        )}

        <div className="product-actions">
          {isInCart ? (
            <div className="in-cart-container">
              <span className="in-cart-badge">✓ In Cart</span>
              <button 
                className="view-cart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/cart');
                }}
              >
                View Cart
              </button>
            </div>
          ) : (
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    promotion: PropTypes.bool,
    stock: PropTypes.number,
    rating: PropTypes.number,
    ratingCount: PropTypes.number,
    freeDelivery: PropTypes.bool,
    createdAt: PropTypes.any
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isInCart: PropTypes.bool.isRequired
};

export default ProductCard; 