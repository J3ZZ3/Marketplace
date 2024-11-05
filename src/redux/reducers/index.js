import { combineReducers } from 'redux';
import productReducer from './productReducer';
import authReducer from './authReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  products: productReducer,
  auth: authReducer,
  cart: cartReducer,
});

export default rootReducer;
