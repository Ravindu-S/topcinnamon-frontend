import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import './Payment.css';

function Payment() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = useAuth();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardHolderName: '',
    email: user?.email || '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Sri Lanka'
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPaymentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCardNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const validateForm = () => {
    const { cardNumber, expiryMonth, expiryYear, cvv, cardHolderName, email, billingAddress } = paymentData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!expiryMonth || !expiryYear) {
      alert('Please enter card expiry date');
      return false;
    }
    
    if (!cvv || cvv.length < 3) {
      alert('Please enter a valid CVV');
      return false;
    }
    
    if (!cardHolderName.trim()) {
      alert('Please enter cardholder name');
      return false;
    }
    
    if (!email.trim()) {
      alert('Please enter email address');
      return false;
    }
    
    if (!billingAddress.street || !billingAddress.city || !billingAddress.zipCode) {
      alert('Please complete billing address');
      return false;
    }
    
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      // Prepare payment data for backend
      const paymentRequest = {
        amount: getCartTotal(),
        currency: 'USD',
        paymentMethod: 'CREDIT_CARD',
        customerEmail: paymentData.email,
        customerName: paymentData.cardHolderName,
        cardNumber: paymentData.cardNumber.replace(/\s/g, ''),
        cardHolderName: paymentData.cardHolderName,
        expiryMonth: paymentData.expiryMonth,
        expiryYear: paymentData.expiryYear,
        cvv: paymentData.cvv,
        returnUrl: 'http://localhost:5173/payment/success',
        cancelUrl: 'http://localhost:5173/payment/cancel',
        description: `Cinnamon Products Order - ${cart.length} items`,
        metadata: JSON.stringify({
          source: 'frontend',
          cartItems: cart.length,
          userId: user?.email
        })
      };

      const response = await fetch('http://localhost:8080/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentRequest)
      });

      const result = await response.json();
      
      console.log('Backend response:', result);

      if (response.ok && result.status === 'COMPLETED') {
        setPaymentStatus('success');
        // Clear cart after successful payment
        clearCart();
        
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          navigate('/payment/success', { 
            state: { 
              paymentId: result.paymentId,
              amount: result.amount,
              orderDetails: cart
            }
          });
        }, 3000);
      } else {
        setPaymentStatus('failed');
        console.error('Payment failed:', result);
        alert(`Payment failed: ${result.errorMessage || result.message || 'Please try again'}`);
      }
    } catch (error) {
      setPaymentStatus('failed');
      console.error('Payment error:', error);
      alert(`Network error: ${error.message}. Please check if the backend is running on port 8080.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'unknown';
  };

  if (paymentStatus === 'success') {
    return (
      <div className="payment-success">
        <div className="success-content">
          <FaCheckCircle className="success-icon" />
          <h1>Payment Successful!</h1>
          <p>Your order has been processed successfully.</p>
          <p>Redirecting to confirmation page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <button onClick={() => navigate('/checkout')} className="back-btn">
          <FaArrowLeft /> Back to Checkout
        </button>
        <h1>Payment Information</h1>
        <p className="payment-subtitle">Complete your order securely</p>
      </div>

      <div className="payment-content">
        <div className="payment-main">
          <form onSubmit={handlePayment} className="payment-form">
            {/* Payment Method */}
            <div className="payment-section">
              <h2>
                <FaCreditCard /> Payment Method
              </h2>
              
              <div className="card-input-group">
                <label>Card Number</label>
                <div className="card-input-wrapper">
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                  />
                  <div className={`card-type ${getCardType(paymentData.cardNumber)}`}></div>
                </div>
              </div>

              <div className="card-details-row">
                <div className="card-input-group">
                  <label>Expiry Date</label>
                  <div className="expiry-inputs">
                    <input
                      type="text"
                      name="expiryMonth"
                      value={paymentData.expiryMonth}
                      onChange={handleInputChange}
                      placeholder="MM"
                      maxLength="2"
                      required
                    />
                    <span>/</span>
                    <input
                      type="text"
                      name="expiryYear"
                      value={paymentData.expiryYear}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>

                <div className="card-input-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    required
                  />
                </div>
              </div>

              <div className="card-input-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardHolderName"
                  value={paymentData.cardHolderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Billing Information */}
            <div className="payment-section">
              <h2>Billing Information</h2>
              
              <div className="card-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={paymentData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="card-input-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="billingAddress.street"
                  value={paymentData.billingAddress.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="billing-row">
                <div className="card-input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={paymentData.billingAddress.city}
                    onChange={handleInputChange}
                    placeholder="Colombo"
                    required
                  />
                </div>

                <div className="card-input-group">
                  <label>State/Province</label>
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={paymentData.billingAddress.state}
                    onChange={handleInputChange}
                    placeholder="Western Province"
                    required
                  />
                </div>

                <div className="card-input-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={paymentData.billingAddress.zipCode}
                    onChange={handleInputChange}
                    placeholder="10000"
                    required
                  />
                </div>
              </div>

              <div className="card-input-group">
                <label>Country</label>
                <select
                  name="billingAddress.country"
                  value={paymentData.billingAddress.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            {/* Security Notice */}
            <div className="security-notice">
              <FaLock className="lock-icon" />
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>

            {/* Payment Button */}
            <button 
              type="submit" 
              className="payment-btn"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="spinner"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay Rs. {getCartTotal().toFixed(2)}
                </>
              )}
            </button>

            {paymentStatus === 'failed' && (
              <div className="payment-error">
                <p>Payment failed. Please check your information and try again.</p>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="payment-sidebar">
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cart.map((item, index) => (
                <div key={`${item.id}-${item.orderType || index}`} className="order-item">
                  <div className="item-image-small">
                    <img 
                      src={`/images/${item.imageFilename}`} 
                      alt={item.name}
                      onError={(e) => e.target.src = '/images/default.jpg'}
                    />
                  </div>
                  <div className="item-details-small">
                    <h4>{item.name}</h4>
                    <p>{item.orderType === 'bulk' ? 'Bulk Order' : 'Single Order'}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price-small">
                    Rs. {((item.orderType === 'bulk' ? item.price * 0.9 : item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs. {getCartTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="total-row">
                <span>Tax</span>
                <span>Rs. 0.00</span>
              </div>
              <div className="total-divider"></div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rs. {getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
