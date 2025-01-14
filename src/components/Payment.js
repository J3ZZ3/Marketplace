import React, { useEffect } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom'; 
import { jsPDF } from 'jspdf';
import Navbar from './Navbar';
import './styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const productDetails = location.state?.productDetails || []; 
  const totalAmount = location.state?.totalAmount || 0; 

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalAmount.toString(),
              },
            }],
          });
        },
        onApprove: async (data, actions) => {
          const details = await actions.order.capture();
          alert('Transaction completed by ' + details.payer.name.given_name);

          const purchaseData = {
            products: productDetails,
            totalAmount: totalAmount,
            payer: {
              name: details.payer.name.given_name,
              email: details.payer.email,
            },
            transactionId: details.id,
            createdAt: new Date().toISOString(),
          };

          generatePDF(purchaseData);

          navigate('/dashboard');
        },
        onError: (err) => {
          console.error('PayPal error:', err);
          alert('There was an error with the payment. Please try again.');
        },
      }).render('#paypal-button-container');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [totalAmount, navigate]);

  const generatePDF = (purchaseData) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Payment Receipt", 10, 10);
    doc.setFontSize(12);
    doc.text(`Payer Name: ${purchaseData.payer.name}`, 10, 20);
    doc.text(`Transaction ID: ${purchaseData.transactionId}`, 10, 40);
    doc.text(`Total Amount: R${purchaseData.totalAmount}`, 10, 50);
    doc.text("Products:", 10, 60);

    let yPosition = 70;
    purchaseData.products.forEach(product => {
      doc.text(`- ${product.name}: R${product.price}`, 10, yPosition);
      yPosition += 10;
    });

    doc.text(`Date: ${purchaseData.createdAt}`, 10, yPosition);
    doc.save("payment_receipt.pdf");
  };

  return (
    <div className="p-payment-container">
      <Navbar />
      <h2 className="p-payment-title">Payment Page</h2>
      <h3 className="p-total-amount">Total Amount to Pay: ${totalAmount}</h3>

      <h4 className="p-items-header">Items:</h4>
      {productDetails.length > 0 ? (
        <ul className="p-product-list">
          {productDetails.map(product => (
            <li key={product.id} className="p-product-item">
              <h5 className="p-product-name">{product.name}</h5>
              <p className="p-product-price">${product.price}</p>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="p-product-image"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-no-items">No items to display.</p>
      )}
      <div id="paypal-button-container" className="paypal-button-container"></div>
    </div>
  );
};

export default Payment;

