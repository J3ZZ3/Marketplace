import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct } from '../redux/actions/productActions'; // Ensure you have an updateProduct action
import { db } from '../firebase'; // Import your firebase config
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './styles/EditProduct.css'; // Use the same styles as AddProduct

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL

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
    specifications: [], // Ensure this is initialized as an array
    features: []
  });

  useEffect(() => {
    const fetchProductData = async () => {
      const productRef = doc(db, 'products', id);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        const data = productSnap.data();
        // Ensure specifications is an array
        setProductData({
          ...data,
          specifications: Array.isArray(data.specifications) ? data.specifications : []
        });
      } else {
        Swal.fire('Error', 'Product not found', 'error');
        navigate('/dashboard');
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecificationChange = (index, key, value) => {
    const newSpecifications = [...productData.specifications];
    newSpecifications[index] = { ...newSpecifications[index], [key]: value };
    setProductData(prev => ({
      ...prev,
      specifications: newSpecifications
    }));
  };

  const addSpecification = () => {
    setProductData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { label: '', value: '' }]
    }));
  };

  const removeSpecification = (index) => {
    setProductData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProduct(id, productData)); // Update product with new data
      Swal.fire('Success', 'Product updated successfully!', 'success');
      navigate('/products');
    } catch (error) {
      Swal.fire('Error', 'Failed to update product', 'error');
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <div className="add-product-header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          <h2>Edit Product</h2>
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
                    {/* Add your categories here */}
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

              <div className="form-section">
                <h3>Product Specifications</h3>
                <div className="specifications-list">
                  {productData.specifications.map((spec, index) => (
                    <div key={index} className="specification-input-group">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)}
                        placeholder="Specification Label"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        placeholder="Specification Value"
                      />
                      <button 
                        type="button" 
                        className="remove-specification-btn"
                        onClick={() => removeSpecification(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="add-specification-btn"
                    onClick={addSpecification}
                  >
                    <i className="fas fa-plus"></i> Add Specification
                  </button>
                </div>
              </div>

              <div className="image-upload-options">
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={productData.imageUrl}
                    onChange={handleChange}
                    placeholder="Image URL"
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">Update Product</button>
            </form>
          </div>

          <div className="product-form-right">
            <div className="form-section">
              <h3>Product Image</h3>
              <div className="image-preview-container">
                {(productData.imageUrl) ? (
                  <img 
                    src={productData.imageUrl} 
                    alt="Product preview" 
                    className="image-preview"
                  />
                ) : (
                  <div className="image-placeholder">
                    <i className="fas fa-image"></i>
                    <p>No image selected</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct; 