import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../redux/actions';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Navbar from './Navbar';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        if (user) {
          const productsCollection = collection(db, 'products');
          const userProductsQuery = query(productsCollection, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(userProductsQuery);
          const userProductList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          setUserProducts(userProductList);
          dispatch(setProducts(userProductList));
        }
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    fetchUserProducts();
  }, [user, dispatch]);

  const handleAddProduct = async () => {
    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const loading = Swal.fire({
      title: 'Adding Product...',
      html: 'Please wait while we add your product.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const reader = new FileReader();
    reader.onloadend = async () => {
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        imageUrl: reader.result,
        userId: user.uid,
      };

      try {
        if (editingProduct) {
          const productRef = doc(db, 'products', editingProduct.id);
          await updateDoc(productRef, productData);
          setUserProducts(prevProducts => prevProducts.map(p => (p.id === editingProduct.id ? { ...p, ...productData } : p)));
          Swal.fire({
            icon: 'success',
            title: 'Product Updated!',
            text: 'Your product has been successfully updated.',
          });
        } else {
          await addDoc(collection(db, 'products'), productData);
          setUserProducts(prevProducts => [...prevProducts, { ...productData, id: Date.now() }]);
          Swal.fire({
            icon: 'success',
            title: 'Product Added!',
            text: 'Your product has been successfully added.',
          });
        }

        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductImage(null);
        setEditingProduct(null);
      } catch (error) {
        console.error('Error saving product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'There was an error saving your product. Please try again.',
        });
      } finally {
        Swal.close();
      }
    };

    if (productImage) {
      reader.readAsDataURL(productImage);
    } else {
      Swal.close();
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select an image before adding the product.',
      });
    }
  };

  const handleEditProduct = (product) => {
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductImage(null);
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    const loading = Swal.fire({
      title: 'Deleting Product...',
      html: 'Please wait while we delete your product.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await deleteDoc(doc(db, 'products', productId));
      setUserProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      Swal.fire({
        icon: 'success',
        title: 'Product Deleted!',
        text: 'Your product has been successfully deleted.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error deleting your product. Please try again.',
      });
    } finally {
      Swal.close();
    }
  };

  const filteredProducts = userProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div>
        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Product Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProductImage(e.target.files[0])}
        />
        <button onClick={handleAddProduct}>{editingProduct ? 'Update Product' : 'Add Product'}</button>
      </div>

      <div>
        <h3>Your Products</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id}>
              <h4>{product.name}</h4>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  style={{ width: '100px', height: 'auto' }} 
                />
              )}
              <p>{product.description}</p>
              <p>${product.price}</p>
              <button onClick={() => handleEditProduct(product)}>Edit</button>
              <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;