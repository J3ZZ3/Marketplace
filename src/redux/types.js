// Define action types
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

// Action creators for authentication and product management
export const loginUser = (user) => ({ type: LOGIN_USER, payload: user });
export const logoutUser = () => ({ type: LOGOUT_USER });
export const addProduct = (product) => ({ type: ADD_PRODUCT, payload: product });
export const removeProduct = (productId) => ({ type: REMOVE_PRODUCT, payload: productId });
