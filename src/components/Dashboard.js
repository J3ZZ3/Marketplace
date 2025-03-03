import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setProducts } from '../redux/actions';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [userProducts, setUserProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUserProducts();
  }, [user, dispatch]);

  const fetchUserProducts = async () => {
    if (user) {
      try {
        const productsCollection = collection(db, 'products');
        const userProductsQuery = query(productsCollection, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(userProductsQuery);
        const userProductList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setUserProducts(userProductList);
        dispatch(setProducts(userProductList));
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    }
  };

  const handleEditProduct = (productId) => {
    navigate(`/add-product?edit=${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'products', productId));
        await fetchUserProducts();
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'There was an error deleting your product.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredProducts = userProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Manage Products</h1>
          <button 
            className="add-product-button"
            onClick={() => navigate('/add-product')}
          >
            Add New Product
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} />
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">R {product.price.toFixed(2)}</p>
                <p className="stock">Stock: {product.stock || 0}</p>
              </div>
              <div className="product-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEditProduct(product.id)}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found</p>
            <button 
              className="add-product-button"
              onClick={() => navigate('/add-product')}
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
