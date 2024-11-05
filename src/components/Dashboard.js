import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../redux/actions';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
  const dispatch = useDispatch();
  const user = auth.currentUser;

  useEffect(() => {
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

    fetchUserProducts();
  }, [user, dispatch]);

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
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await deleteDoc(doc(db, 'products', productId));
        setUserProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'There was an error deleting your product.', 'error');
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
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
    <Navbar />

      <div className="dashboard">
      <div className="db-form-container">
        <h3 className='db-h3'>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <input type="text" className="db-input" placeholder="Product Name" value={productName} onChange={e => setProductName(e.target.value)} />
        <input type="text" className="db-input" placeholder="Product Description" value={productDescription} onChange={e => setProductDescription(e.target.value)} />
        <input type="number" className="db-input" placeholder="Product Price" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
        <input type="file" className="db-input-file" accept="image/*" onChange={e => setProductImage(e.target.files[0])} />
        <button className="db-btn" onClick={handleAddProduct} disabled={isLoading}>
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <div className="db-product-list">
        <h3>Your Products</h3>
        <input type="text" className="pl-input" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="db-product-card">
              <h4 className="product-title">{product.name}</h4>
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="product-image" />}
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => handleEditProduct(product)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="db-no-products">No products found.</p>
        )}
      </div>
    </div>
    </div>
 
  );
};

export default Dashboard;
