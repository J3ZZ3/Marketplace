import React from 'react';
import './styles/ProductInformation.css';

const ProductInformation = ({ product }) => {
  return (
    <div className="product-information-section">
      <h2 className="section-title">Product Information</h2>
      <div className="product-information-content">
        <div className="info-tabs">
          <div className="info-tab active">
            <h3>Specifications</h3>
            <div className="specifications-grid">
              <div className="spec-item">
                <span className="spec-label">Brand</span>
                <span className="spec-value">{product.brand}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Model</span>
                <span className="spec-value">{product.model}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">SKU</span>
                <span className="spec-value">{product.sku}</span>
              </div>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-tab">
            <h3>Features</h3>
            <ul className="features-list">
              {product.features && product.features.map((feature, index) => (
                <li key={index}>
                  <i className="fas fa-check"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-tab">
            <h3>Shipping Information</h3>
            <div className="shipping-info">
              <div className="shipping-item">
                <i className="fas fa-truck"></i>
                <div className="shipping-details">
                  <h4>Standard Delivery</h4>
                  <p>2-4 Business Days</p>
                </div>
              </div>
              <div className="shipping-item">
                <i className="fas fa-store"></i>
                <div className="shipping-details">
                  <h4>Collect in Store</h4>
                  <p>Available at selected stores</p>
                </div>
              </div>
              <div className="shipping-item">
                <i className="fas fa-box"></i>
                <div className="shipping-details">
                  <h4>Return Policy</h4>
                  <p>30 Days Return Policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation; 