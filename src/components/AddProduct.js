import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../redux/actions';
import { storage } from '../firebase'; // Make sure to import storage from firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import './styles/AddProduct.css';
import { auth } from '../firebase'; // Make sure to import auth from firebase config
import { serverTimestamp } from 'firebase/firestore';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = auth.currentUser; // Get current user

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    brand: '',
    model: '',
    sku: '',
    stock: '',
    specifications: {}
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Toys',
    'Automotive',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setProductData(prev => ({
      ...prev,
      imageUrl: value
    }));
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to add products'
      });
      navigate('/login');
      return;
    }

    if (!productData.category) {
      Swal.fire({
        icon: 'warning',
        title: 'Category Required',
        text: 'Please select a category for your product.'
      });
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = productData.imageUrl;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const newProduct = {
        name: productData.name,
        price: Number(productData.price),
        description: productData.description,
        category: productData.category,
        imageUrl: imageUrl,
        brand: productData.brand,
        model: productData.model,
        sku: productData.sku,
        stock: Number(productData.stock),
        userId: user.uid,
        createdAt: new Date().toISOString(),
        specifications: {
          brand: productData.brand,
          model: productData.model,
          sku: productData.sku
        }
      };

      await dispatch(addProduct(newProduct));

      Swal.fire({
        icon: 'success',
        title: 'Product Added Successfully!',
        showConfirmButton: false,
        timer: 1500
      });

      navigate('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add product. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="add-product-page">
      <Navbar />
      <div className="add-product-container">
        <div className="add-product-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>Add New Product</h2>
        </div>
        
        <div className="add-product-content">
          <div className="product-form-left">
            <form onSubmit={handleSubmit} className="add-product-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={productData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                    className="category-select"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    <option value="custom">Add Custom Category</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Product Details</h3>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    placeholder="Product Description"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={productData.brand}
                      onChange={handleChange}
                      placeholder="Brand"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Model</label>
                    <input
                      type="text"
                      name="model"
                      value={productData.model}
                      onChange={handleChange}
                      placeholder="Model"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={productData.sku}
                      onChange={handleChange}
                      placeholder="SKU"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={productData.stock}
                      onChange={handleChange}
                      placeholder="Stock Quantity"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="product-form-right">
            <div className="form-section">
              <h3>Product Image</h3>
              <div className="image-preview-container">
                {(imagePreview || productData.imageUrl) ? (
                  <img 
                    src={imagePreview || productData.imageUrl} 
                    alt="Product preview" 
                    className="image-preview"
                  />
                ) : (
                  <div className="image-placeholder">
                    <i className="fas fa-image"></i>
                    <p>No image selected</p>
                  </div>
                )}
                {isUploading && (
                  <div className="upload-overlay">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Uploading...</p>
                  </div>
                )}
              </div>

              <div className="image-upload-options">
                <div className="form-group">
                  <label>Upload Image</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="file-input-label">
                      <i className="fas fa-upload"></i>
                      Choose File
                    </label>
                    {imageFile && (
                      <span className="file-name">{imageFile.name}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Or Enter Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={productData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Image URL"
                    className={imageFile ? 'disabled' : ''}
                    disabled={!!imageFile}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
