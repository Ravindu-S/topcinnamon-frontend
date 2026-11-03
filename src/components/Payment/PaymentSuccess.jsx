import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaReceipt } from 'react-icons/fa';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const location = useLocation();
  const { paymentId, amount, orderDetails } = location.state || {};

  return (
    <div className="payment-success-container">
      <div className="success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>
        
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {paymentId && (
          <div className="order-details">
            <div className="detail-row">
              <span className="label">Payment ID:</span>
              <span className="value">{paymentId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Amount Paid:</span>
              <span className="value">Rs. {amount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Order Date:</span>
              <span className="value">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}

        <div className="order-items-summary">
          <h3>Order Summary</h3>
          {orderDetails && orderDetails.length > 0 ? (
            <div className="items-list">
              {orderDetails.map((item, index) => (
                <div key={`${item.id}-${item.orderType || index}`} className="order-item">
                  <div className="item-image">
                    <img 
                      src={`/images/${item.imageFilename}`} 
                      alt={item.name}
                      onError={(e) => e.target.src = '/images/default.jpg'}
                    />
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.orderType === 'bulk' ? 'Bulk Order' : 'Single Order'}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    Rs. {((item.orderType === 'bulk' ? item.price * 0.9 : item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Order details will be sent to your email.</p>
          )}
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>You will receive an order confirmation email shortly</li>
            <li>Your order will be processed within 1-2 business days</li>
            <li>You will receive tracking information once your order ships</li>
            <li>Expected delivery: 3-5 business days</li>
          </ul>
        </div>

        <div className="action-buttons">
          <Link to="/" className="btn-primary">
            <FaHome /> Continue Shopping
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            <FaReceipt /> View Orders
          </Link>
        </div>

        <div className="support-info">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@cinnamonmiracle.com">support@cinnamonmiracle.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
