import { firestore } from '../../firebase/firebaseConfig';
import { FETCH_PRODUCTS, ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../types';

export const fetchProducts = () => async dispatch => {
  try {
    const snapshot = await firestore.collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: FETCH_PRODUCTS, payload: products });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

export const addProduct = product => async dispatch => {
  try {
    const docRef = await firestore.collection('products').add(product);
    dispatch({ type: ADD_PRODUCT, payload: { id: docRef.id, ...product } });
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const updateProduct = (id, updates) => async dispatch => {
  try {
    await firestore.collection('products').doc(id).update(updates);
    dispatch({ type: UPDATE_PRODUCT, payload: { id, updates } });
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

export const deleteProduct = id => async dispatch => {
  try {
    await firestore.collection('products').doc(id).delete();
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};
