// cartReducer.js

import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions';

const initialState = {
  items: [], // Initial state with items as an empty array
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return { ...state, items: [...state.items, action.payload] };

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(product => product.id !== action.payload),
      };

    default:
      return state; // Return current state for unrecognized actions
  }
};

export default cartReducer;
