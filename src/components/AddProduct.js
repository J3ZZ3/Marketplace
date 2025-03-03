import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/actions';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './styles/AddProduct.css';

const AddProduct = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    brand: '',
    model: '',
    sku: '',
    category: 'electronics',
    imageUrl: '',
    specifications: {},
    features: [],
    promotion: false,
    freeDelivery: false,
    warranty: '24-Month Manufacturer Warranty',
    deliveryTime: '2-4 Business Days',
    returnPolicy: '30 Days Return Policy',
    collectInStore: false,
    rating: 0,
    ratingCount: 0,
    reviews: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [feature, setFeature] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        Swal.fire({
          icon: 'error',
          title: 'File too large',
          text: 'Please select an image smaller than 500KB',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({
          ...prev,
          imageUrl: reader.result // This will be the base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const addFeature = () => {
    if (feature.trim()) {
      setProductData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
      setFeature('');
    }
  };

  const removeFeature = (index) => {
    setProductData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setProductData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey.trim()]: specValue.trim()
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key) => {
    setProductData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleImageUpload = async (file) => {
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      
      // Add metadata including CORS settings
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        }
      };

      // Upload the file with metadata
      const uploadTask = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate price is a number
      const numericPrice = Number(productData.price);
      if (isNaN(numericPrice)) {
        throw new Error('Price must be a valid number');
      }

      // Add product to Firestore with base64 image
      await addDoc(collection(db, 'products'), {
        ...productData,
        price: numericPrice,
        createdAt: new Date(),
      });

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Product added successfully',
      });

      // Reset form
      setProductData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stock: '',
        brand: '',
        model: '',
        sku: '',
        category: 'electronics',
        imageUrl: '',
        specifications: {},
        features: [],
        promotion: false,
        freeDelivery: false,
        warranty: '24-Month Manufacturer Warranty',
        deliveryTime: '2-4 Business Days',
        returnPolicy: '30 Days Return Policy',
        collectInStore: false,
        rating: 0,
        ratingCount: 0,
        reviews: []
      });
      
    } catch (error) {
      console.error('Error adding product: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to add product. Please try again.',
      });
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            value={productData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={productData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={productData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={productData.category}
            onChange={handleInputChange}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Living</option>
            <option value="sports">Sports & Outdoors</option>
            <option value="beauty">Beauty & Health</option>
            <option value="books">Books & Media</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {productData.imageUrl && (
            <div className="image-preview">
              <img src={productData.imageUrl} alt="Preview" />
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
