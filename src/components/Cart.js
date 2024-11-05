import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/actions";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


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

    navigate("/payment", {
      state: {
        productDetails,
        totalAmount,
      },
    });
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  return (
    <div>
      <Navbar />
      <h2>Shopping Cart</h2>
      {products.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "250px", height: "auto" }}
              />
            )}
            <p>R{product.price}</p>
            <button onClick={() => handleRemoveFromCart(product.id)}>
              Remove
            </button>{" "}
            {}
          </div>
        ))
      )}
      {products.length > 0 && <button onClick={handlePayNow}>Pay Now</button>}
    </div>
  );
};

export default Cart;
