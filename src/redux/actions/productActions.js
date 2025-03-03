import { db } from '../../firebase';
import axios from 'axios';
import { FETCH_PRODUCTS, ADD_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../types';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const fetchProducts = () => async dispatch => {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    dispatch({ type: FETCH_PRODUCTS, payload: products });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

// Function to convert image file to Base64
export const uploadImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
  return response.data.secure_url; // Return the URL of the uploaded image
};

export const addProduct = (product, imageFile) => async dispatch => {
  try {
    // Upload image to Cloudinary
    const imageUrl = await uploadImageToCloudinary(imageFile);
    
    // Add product with image URL
    const newProduct = { ...product, imageUrl }; // Assuming product has other properties
    const docRef = await addDoc(collection(db, 'products'), newProduct);
    dispatch({ type: ADD_PRODUCT, payload: { id: docRef.id, ...newProduct } });
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const updateProduct = (id, updates) => async dispatch => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, updates);
    dispatch({ type: UPDATE_PRODUCT, payload: { id, updates } });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error; // Rethrow to handle in the component
  }
};

export const deleteProduct = id => async dispatch => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};
