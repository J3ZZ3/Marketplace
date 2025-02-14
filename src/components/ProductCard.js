import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles/ProductCard.css';

const ProductCard = ({ product, onAddToCart, isInCart }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    onAddToCart(product);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image-container">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-image"
          loading="lazy"
        />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      {isInCart ? (
        <span className="in-cart-badge">In Cart</span>
      ) : (
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isInCart: PropTypes.bool.isRequired,
};

export default ProductCard; 