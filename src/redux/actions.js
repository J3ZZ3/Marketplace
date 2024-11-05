// actions.js

// Define action types
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_PRODUCTS = 'SET_PRODUCTS'; // New action type
export const ADD_TO_CART = 'ADD_TO_CART'; 
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'; // Add this line for removeFromCart

// Action creators for authentication
export const loginUser = (user) => ({
  type: LOGIN_USER,
  payload: user,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

// Action creators for product management
export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product,
});

export const removeProduct = (productId) => ({
  type: REMOVE_PRODUCT,
  payload: productId,
});

// New action creator for setting products
export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

// Action creator for adding to cart
export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

// Action creator for removing from cart
export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});
