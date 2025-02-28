import React, { useEffect, useRef } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom'; 
import { jsPDF } from 'jspdf';
import Navbar from './Navbar';
import './styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const productDetails = location.state?.productDetails || []; 
  const totalAmount = location.state?.totalAmount || 0;
  const paypalButtonRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    if (!location.state) {
      navigate('/cart');
      return;
    }

    const loadPayPalScript = () => {
      // Remove any existing PayPal script
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }

      // Clear any existing PayPal button
      if (paypalButtonRef.current) {
        paypalButtonRef.current.innerHTML = '';
      }

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
        }).render(paypalButtonRef.current);
      };

      scriptRef.current = script;
      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      // Cleanup on unmount
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, [totalAmount, navigate, location.state, productDetails]);

  const generatePDF = (purchaseData) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Payment Receipt", 10, 10);
    doc.setFontSize(12);
    doc.text(`Payer Name: ${purchaseData.payer.name}`, 10, 20);
    doc.text(`Transaction ID: ${purchaseData.transactionId}`, 10, 40);
    doc.text(`Total Amount: $${purchaseData.totalAmount}`, 10, 50);
    doc.text("Products:", 10, 60);

    let yPosition = 70;
    purchaseData.products.forEach(product => {
      doc.text(`- ${product.name}: $${product.price}`, 10, yPosition);
      yPosition += 10;
    });

    doc.text(`Date: ${purchaseData.createdAt}`, 10, yPosition);
    doc.save("payment_receipt.pdf");
  };

  return (
    <div className="p-payment-container">
      <Navbar />
      <div className="p-payment-content">
        <h2 className="p-payment-title">Checkout</h2>
        
        <div className="p-payment-layout">
          <div className="p-order-details">
            <h3 className="p-items-header">Order Details</h3>
            {productDetails.length > 0 ? (
              <ul className="p-product-list">
                {productDetails.map(product => (
                  <li key={product.id} className="p-product-item">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="p-product-image"
                      />
                    )}
                    <h5 className="p-product-name">{product.name}</h5>
                    <p className="p-product-price">${product.price.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-no-items">No items to display.</p>
            )}
          </div>

          <div className="p-payment-summary">
            <h3 className="p-summary-title">Payment Summary</h3>
            <div className="p-summary-row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="p-summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="p-summary-total">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div ref={paypalButtonRef} id="paypal-button-container" className="p-paypal-button-container" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

