import React from 'react';
import './styles/FeaturedProductsSection.css'; // Create a separate CSS file for styling

const FeaturedProductsSection = ({ products }) => {
  return (
    <div className="featured-products-section">
      <h2>Featured Products</h2>
      <div className="featured-products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.imageUrl} alt={product.name} />
            <h4>{product.name}</h4>
            <p>${product.price}</p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsSection; 