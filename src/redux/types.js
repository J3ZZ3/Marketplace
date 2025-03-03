export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const loginUser = (user) => ({ type: LOGIN_USER, payload: user });
export const logoutUser = () => ({ type: LOGOUT_USER });
export const addProduct = (product) => ({ type: ADD_PRODUCT, payload: product });
export const removeProduct = (productId) => ({ type: REMOVE_PRODUCT, payload: productId });
