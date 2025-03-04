import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/actions";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './styles/Cart.css';

const Cart = () => {
  const products = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize quantities state
  const [quantities, setQuantities] = useState(
    products.reduce((acc, product) => {
      acc[product.id] = 1; // Default quantity to 1
      return acc;
    }, {})
  );

  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      const cartItems = JSON.parse(savedCartItems);
      cartItems.forEach(itemId => {
        // Assuming you have a way to fetch product details by ID
        // You might want to dispatch an action to fetch product details
      });
    }
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, newQuantity), // Ensure quantity is at least 1
    }));
  };

  const totalAmount = products.reduce((total, product) => {
    const quantity = quantities[product.id] || 1; // Default to 1 if not set
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    return total + price * quantity;
  }, 0);

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
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[productId]; // Remove quantity for the removed product
    setQuantities(updatedQuantities);
  };

  const handleClearCart = () => {
    // Clear the cart in Redux and local storage
    products.forEach(product => {
      dispatch(removeFromCart(product.id));
    });
    localStorage.removeItem('cartItems'); // Clear local storage
    setQuantities({}); // Reset quantities state
  };

  console.log(products); // Log the products array to inspect the price values

  const renderCartItems = () => {
    return products.map((product) => {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      return (
        <div key={product.id} className="cart-item">
          <div className="item-image">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} />
            )}
          </div>
          <div className="item-details">
            <h3>{product.name}</h3>
            <input
              type="number"
              className="quantity-input"
              value={quantities[product.id] || 1}
              min="1"
              onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
            />
            <button 
              onClick={() => handleRemoveFromCart(product.id)}
              className="remove-button"
            >
              Remove
            </button>
          </div>
          <div className="item-price">
            <span className="price">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      );
    });
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
              renderCartItems()
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
                  <span>${totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}</span>
                </div>
                <button onClick={handlePayNow} className="checkout-button">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
        <button onClick={handleClearCart} className="clear-cart-button">Clear Cart</button>
      </div>
    </div>
  );
};

export default Cart;
