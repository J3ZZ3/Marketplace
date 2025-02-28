import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/actions";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './styles/Cart.css';

const Cart = () => {
  const products = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = products.reduce((total, product) => total + product.price, 0);

  const handlePayNow = () => {
    const productDetails = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }));

    navigate("/payment", { state: { productDetails, totalAmount } });
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <span className="item-count">{products.length} items</span>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {products.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button onClick={() => navigate('/')} className="continue-shopping">
                  Continue Shopping
                </button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="cart-item">
                  <div className="item-image">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} />
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{product.name}</h3>
                    <button 
                      onClick={() => handleRemoveFromCart(product.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-price">
                    <span className="price">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {products.length > 0 && (
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <button onClick={handlePayNow} className="checkout-button">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
