import { combineReducers } from 'redux';
import productReducer from './productReducer';
import authReducer from './authReducer';
import cartReducer from './cartReducer'; // Import the cartReducer

const rootReducer = combineReducers({
  products: productReducer,
  auth: authReducer,
  cart: cartReducer, // Add cartReducer here
});

export default rootReducer;
