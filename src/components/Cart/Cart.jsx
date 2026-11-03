import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import './Cart.css';

function Cart() {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, orderType, newQuantity) => {
    const minQty = orderType === 'bulk' ? 10 : 1;
    if (newQuantity >= minQty) {
      updateCartQuantity(productId, orderType, newQuantity);
    }
  };

    const handleCheckout = () => {
    navigate('/checkout');
    };

  const getItemPrice = (item) => {
    return item.orderType === 'bulk' ? item.price * 0.9 : item.price;
  };

  const getItemTotal = (item) => {
    return getItemPrice(item) * item.quantity;
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">
          <FaShoppingBag />
        </div>
        <h2>Your Cart is Empty</h2>
        <p>Add some delicious cinnamon products to get started!</p>
        <Link to="/products" className="btn-primary">
          Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <Link to="/products" className="back-btn">
          <FaArrowLeft /> Continue Shopping
        </Link>
        <h1>Shopping Cart</h1>
        <p className="cart-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={`${item.id}-${item.orderType}`} className="cart-item">
              <div className="item-image">
                <img 
                  src={`/images/${item.imageFilename}`} 
                  alt={item.name}
                  onError={(e) => e.target.src = '/images/default.jpg'}
                />
                {item.orderType === 'bulk' && (
                  <span className="bulk-badge">BULK -10%</span>
                )}
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-type">{item.orderType === 'bulk' ? 'Bulk Order' : 'Single Order'}</p>
                <p className="item-price">
                  Rs. {getItemPrice(item).toFixed(2)} 
                  <span className="unit"> ({item.name?.toLowerCase().includes('oil') ? 'per 100ml' : 'per 100g'})</span>
                </p>
              </div>

              <div className="item-quantity">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.orderType, item.quantity - 1)}
                  disabled={item.quantity <= (item.orderType === 'bulk' ? 10 : 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, item.orderType, parseInt(e.target.value) || 1)}
                  min={item.orderType === 'bulk' ? 10 : 1}
                />
                <button onClick={() => handleQuantityChange(item.id, item.orderType, item.quantity + 1)}>
                  +
                </button>
              </div>

              <div className="item-total">
                <p className="total-label">Total</p>
                <p className="total-price">Rs. {getItemTotal(item).toFixed(2)}</p>
              </div>

              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id, item.orderType)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row discount">
              <span>Bulk Discount</span>
              <span className="discount-amount">
                -Rs. {cart.reduce((total, item) => {
                  if (item.orderType === 'bulk') {
                    return total + (item.price * 0.1 * item.quantity);
                  }
                  return total;
                }, 0).toFixed(2)}
              </span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>

          <div className="shipping-info">
            <p>✓ Free shipping on orders over Rs. 1000</p>
            <p>✓ Secure checkout</p>
            <p>✓ 30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;