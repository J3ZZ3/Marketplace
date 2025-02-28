import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../redux/actions';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import './styles/Dashboard.css';

const Dashboard = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'purchases'
  const [purchases, setPurchases] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchUserProducts();
      fetchUserPurchases();
    }
  }, [user, navigate]);

  useEffect(() => {
    // Extract unique categories from products
    if (userProducts.length > 0) {
      const uniqueCategories = [...new Set(userProducts.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  }, [userProducts]);

  const fetchUserProducts = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const productsCollection = collection(db, 'products');
      const userProductsQuery = query(productsCollection, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(userProductsQuery);
      const userProductList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setUserProducts(userProductList);
      dispatch(setProducts(userProductList));
    } catch (error) {
      console.error('Error fetching user products:', error);
      Swal.fire('Error', 'Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPurchases = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const purchasesCollection = collection(db, 'purchases');
      const userPurchasesQuery = query(purchasesCollection, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(userPurchasesQuery);
      const userPurchasesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPurchases(userPurchasesList);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      Swal.fire('Error', 'Failed to load purchase history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!user) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        imageUrl: reader.result,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      try {
        if (editingProduct) {
          const productRef = doc(db, 'products', editingProduct.id);
          await updateDoc(productRef, productData);
          setUserProducts(prevProducts => prevProducts.map(p => (p.id === editingProduct.id ? { ...p, ...productData } : p)));
          Swal.fire('Success', 'Product Updated!', 'success');
        } else {
          const docRef = await addDoc(collection(db, 'products'), productData);
          setUserProducts(prevProducts => [...prevProducts, { ...productData, id: docRef.id }]);
          Swal.fire('Success', 'Product Added!', 'success');
        }

        resetForm();
      } catch (error) {
        console.error('Error saving product:', error);
        Swal.fire('Error', 'There was an error saving your product.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (productImage) {
      reader.readAsDataURL(productImage);
    } else {
      Swal.fire('Warning', 'Please select an image before adding the product.', 'warning');
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'products', productId));
        setUserProducts(prev => prev.filter(product => product.id !== productId));
        Swal.fire('Deleted!', 'Product has been removed', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'Failed to delete product', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductImage(null);
    setEditingProduct(null);
    setSearchTerm('');
  };

  const filteredProducts = userProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  );

  const getProductCountByCategory = (category) => {
    return userProducts.filter(product => product.category === category).length;
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>My Dashboard</h1>
            <div className="dashboard-tabs">
              <button 
                className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                My Products
              </button>
              <button 
                className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
                onClick={() => setActiveTab('purchases')}
              >
                Purchase History
              </button>
            </div>
          </div>
          {activeTab === 'products' && (
            <div className="header-actions">
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
              <Link to="/add-product" className="add-product-button">
                <i className="fas fa-plus"></i>
                Add New Product
              </Link>
            </div>
          )}
        </div>

        {activeTab === 'products' ? (
          <>
            <div className="category-tabs">
              <button 
                className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Products
                <span className="category-count">{userProducts.length}</span>
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                  <span className="category-count">{getProductCountByCategory(category)}</span>
                </button>
              ))}
            </div>

            <div className="dashboard-tools">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search your products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <span>Loading products...</span>
              </div>
            ) : (
              <div className={`product-grid ${viewMode}`}>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image-wrapper">
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="price">${product.price}</p>
                        <p className="description">{product.description}</p>
                      </div>
                      <div className="product-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => navigate(`/edit-product/${product.id}`)}
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <i className="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-products">
                    <i className="fas fa-box-open"></i>
                    <h3>No products found</h3>
                    <p>Start by adding your first product!</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="purchases-section">
            <h2 className="purchases-title">Purchase History</h2>
            {purchases.length > 0 ? (
              <div className="purchases-list">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="purchase-card">
                    <div className="purchase-header">
                      <div className="purchase-info">
                        <span className="purchase-date">
                          {new Date(purchase.createdAt?.toDate()).toLocaleDateString()}
                        </span>
                        <span className="purchase-id">Order #{purchase.transactionId}</span>
                      </div>
                      <span className="purchase-total">${purchase.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="purchase-items">
                      {purchase.products.map((product, index) => (
                        <div key={index} className="purchase-item">
                          <img src={product.imageUrl} alt={product.name} className="item-image" />
                          <div className="item-details">
                            <h4>{product.name}</h4>
                            <span className="item-price">${product.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="purchase-actions">
                      <button className="view-receipt-btn" onClick={() => window.open(purchase.receiptUrl, '_blank')}>
                        <i className="fas fa-file-pdf"></i>
                        View Receipt
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-purchases">
                <i className="fas fa-shopping-bag"></i>
                <h3>No purchases yet</h3>
                <p>Your purchase history will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
