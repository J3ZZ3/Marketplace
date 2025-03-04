import React, { useEffect, useRef } from 'react';

const TestPayment = () => {
  const paypalButtonRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    const loadPayPalScript = () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
      script.async = true;

      script.onload = () => {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '10.00', // Test amount
                },
              }],
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            console.log('Transaction completed:', details);
          },
          onError: (err) => {
            console.error('PayPal error:', err);
          },
        }).render(paypalButtonRef.current);
      };

      scriptRef.current = script;
      document.body.appendChild(script);
    };

    loadPayPalScript();

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <h2>Test PayPal Button</h2>
      <div ref={paypalButtonRef} />
    </div>
  );
};

export default TestPayment; 