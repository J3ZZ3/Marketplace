import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/actions';

const Cart = () => {
  const products = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const handlePayNow = () => {
  
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {products.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        products.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            {product.imageUrl && (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '250px', height: 'auto' }}
              />
            )}
            <p>R{product.price}</p>
            <button onClick={() => handleRemoveFromCart(product.id)}>Remove</button> {}
          </div>
        ))
      )}
      {products.length > 0 && (
        <button onClick={handlePayNow}>Pay Now</button>
      )}
    </div>
  );
};

export default Cart;
