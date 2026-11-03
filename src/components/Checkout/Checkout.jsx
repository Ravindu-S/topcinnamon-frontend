import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import './Checkout.css';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, getCartTotal, user } = useAuth();

  // Check if it's a direct buy or cart checkout
  const directBuy = location.state?.directBuy || false;
  const directProduct = location.state?.product;

  // Get items to checkout
  const checkoutItems = directBuy && directProduct ? [directProduct] : cart;

  // Calculate total
  const calculateTotal = () => {
    if (directBuy && directProduct) {
      const price = directProduct.orderType === 'bulk' 
        ? directProduct.price * 0.9 
        : directProduct.price;
      return (price * directProduct.quantity).toFixed(2);
    }
    return getCartTotal().toFixed(2);
  };

  const getItemPrice = (item) => {
    return item.orderType === 'bulk' ? item.price * 0.9 : item.price;
  };

  const handlePlaceOrder = () => {
    navigate('/payment');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>No items to checkout</h2>
        <Link to="/products" className="btn-primary">
          Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <Link to={directBuy ? -1 : '/cart'} className="back-btn">
          <FaArrowLeft /> Back
        </Link>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        {/* Order Summary */}
        <div className="checkout-main">
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {checkoutItems.map((item, index) => (
                <div key={`${item.id}-${item.orderType || index}`} className="checkout-item">
                  <div className="item-image-small">
                    <img 
                      src={`/images/${item.imageFilename}`} 
                      alt={item.name}
                      onError={(e) => e.target.src = '/images/default.jpg'}
                    />
                  </div>
                  <div className="item-details-checkout">
                    <h3>{item.name}</h3>
                    <p className="item-type-small">
                      {item.orderType === 'bulk' ? 'Bulk Order' : 'Single Order'}
                    </p>
                    <p className="item-quantity-small">Quantity: {item.quantity}</p>
                  </div>
                  <div className="item-price-checkout">
                    <p className="unit-price">Rs. {getItemPrice(item).toFixed(2)} each</p>
                    <p className="total-price">Rs. {(getItemPrice(item) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="checkout-section">
            <h2>Shipping Address</h2>
            <form className="shipping-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue={user.firstName} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue={user.lastName} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={user.email} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue={user.mobile} required />
              </div>
              <div className="form-group">
                <label>Address Line 1</label>
                <input type="text" placeholder="Street address" required />
              </div>
              <div className="form-group">
                <label>Address Line 2</label>
                <input type="text" placeholder="Apartment, suite, etc. (optional)" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="City" required />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input type="text" placeholder="Postal code" required />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Total Sidebar */}
        <div className="checkout-sidebar">
          <div className="order-total-card">
            <h2>Order Total</h2>
            
            <div className="total-breakdown">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
              {checkoutItems.some(item => item.orderType === 'bulk') && (
                <div className="total-row discount">
                  <span>Bulk Discount</span>
                  <span className="discount-amount">
                    -Rs. {checkoutItems.reduce((total, item) => {
                      if (item.orderType === 'bulk') {
                        return total + (item.price * 0.1 * item.quantity);
                      }
                      return total;
                    }, 0).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="total-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="total-divider"></div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              <FaCheckCircle /> Place Order
            </button>

            <div className="security-info">
              <p>✓ Secure checkout</p>
              <p>✓ 30-day money-back guarantee</p>
              <p>✓ Free shipping on all orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;