import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaShoppingBag, 
  FaHeart, 
  FaStar, 
  FaCog, 
  FaSignOutAlt,
  FaEdit,
  FaBox,
  FaTruck,
  FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, logout, cart, addToCart } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/payment/all`);
        const payments = await response.json();
        
        // Filter payments for current user and convert to orders
        const userOrders = payments
          .filter(payment => payment.customerEmail === user.email && payment.status === 'COMPLETED')
          .map(payment => ({
            id: payment.paymentId,
            date: payment.createdAt,
            items: 1, // We can enhance this later
            total: parseFloat(payment.amount),
            status: 'delivered' // All completed payments are treated as delivered
          }));
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Fetch real products for wishlist
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/products');
        const allProducts = await response.json();
        setWishlist(allProducts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'shipping':
        return <FaTruck className="status-icon shipping" />;
      case 'processing':
        return <FaBox className="status-icon processing" />;
      default:
        return null;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} className={i < rating ? 'star filled' : 'star'} />
    ));
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="user-profile-card">
          <div className="profile-avatar">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <h3>{user.firstName} {user.lastName}</h3>
          <p>{user.email}</p>
        </div>

        <nav className="dashboard-nav">
          <button 
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            <FaUser /> Overview
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> My Orders
          </button>
          <button 
            className={activeTab === 'wishlist' ? 'active' : ''}
            onClick={() => setActiveTab('wishlist')}
          >
            <FaHeart /> Wishlist
          </button>
          <button 
            className={activeTab === 'reviews' ? 'active' : ''}
            onClick={() => setActiveTab('reviews')}
          >
            <FaStar /> My Reviews
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <h1>Welcome back, {user.firstName}! 👋</h1>
            <p className="subtitle">Here's what's happening with your account</p>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orders">
                  <FaShoppingBag />
                </div>
                <div className="stat-info">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon wishlist">
                  <FaHeart />
                </div>
                <div className="stat-info">
                  <h3>{wishlist.length}</h3>
                  <p>Wishlist Items</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon reviews">
                  <FaStar />
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Reviews Written</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon cart">
                  <FaBox />
                </div>
                <div className="stat-info">
                  <h3>{cart.length}</h3>
                  <p>Cart Items</p>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="section">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="view-all-btn">
                  View All
                </button>
              </div>
              <div className="orders-list">
                {loadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
                    No orders yet
                  </div>
                ) : (
                  orders.slice(0, 3).map(order => (
                  <div key={order.id} className="order-card-mini">
                    <div className="order-info">
                      {getStatusIcon(order.status)}
                      <div>
                        <h4>{order.id}</h4>
                        <p>{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="order-details">
                      <span className="items-count">{order.items} items</span>
                      <span className="order-total">Rs. {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <Link to="/products" className="action-card">
                  <FaShoppingBag />
                  <span>Continue Shopping</span>
                </Link>
                <Link to="/cart" className="action-card">
                  <FaBox />
                  <span>View Cart</span>
                </Link>
                <button onClick={() => setActiveTab('wishlist')} className="action-card">
                  <FaHeart />
                  <span>My Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <h1>My Orders</h1>
            <p className="subtitle">Track and manage your orders</p>

            <div className="orders-full-list">
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color)' }}>
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>You haven't placed any orders yet</p>
                  <Link to="/products" className="btn-primary">
                    Shop Now
                  </Link>
                </div>
              ) : (
                orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-id-section">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3>{order.id}</h3>
                        <p className="order-date">
                          Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <span className={`status-badge ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="order-body">
                    <div className="order-stat">
                      <span className="label">Items:</span>
                      <span className="value">{order.items}</span>
                    </div>
                    <div className="order-stat">
                      <span className="label">Total:</span>
                      <span className="value total-price">Rs. {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="order-actions">
                    <button className="btn-secondary-small">View Details</button>
                    {order.status === 'delivered' && (
                      <button className="btn-primary-small">Write Review</button>
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="dashboard-content">
            <h1>My Wishlist</h1>
            <p className="subtitle">Your favorite products</p>

            {loadingWishlist ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-color)' }}>
                Loading wishlist...
              </div>
            ) : wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
                  Your wishlist is empty
                </p>
                <Link to="/products" className="btn-primary">
                  Browse
                </Link>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(item => (
                  <div key={item.id} className="wishlist-card">
                    <div className="wishlist-image">
                      <img 
                        src={`/images/${item.imageFilename}`} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/images/default.jpg';
                        }}
                      />
                      <button className="remove-wishlist" onClick={() => {
                        setWishlist(wishlist.filter(w => w.id !== item.id));
                      }}>
                        ×
                      </button>
                    </div>
                    <div className="wishlist-info">
                      <h3>{item.name}</h3>
                      <p className="wishlist-price">Rs. {item.price.toFixed(2)}</p>
                      <div className="wishlist-actions">
                        <button 
                          className="btn-primary-small"
                          onClick={() => {
                            addToCart(item, 1, 'single');
                            alert('Added to cart!');
                          }}
                        >
                          Add to Cart
                        </button>
                        <Link to={`/products/${item.id}`} className="btn-ghost-small">
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab - Placeholder */}
        {activeTab === 'reviews' && (
          <div className="dashboard-content">
            <h1>My Reviews</h1>
            <p className="subtitle">Products you've reviewed</p>

            <div className="reviews-placeholder">
              <p className="placeholder-text">Review functionality coming soon!</p>
              <p className="placeholder-subtext">
                You'll be able to view and manage your product reviews here.
              </p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="dashboard-content">
            <h1>Account Settings</h1>
            <p className="subtitle">Manage your account information</p>

            <div className="settings-sections">
              {/* Personal Information */}
              <div className="settings-card">
                <h2>Personal Information</h2>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue={user.firstName} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue={user.lastName} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email} />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" defaultValue={user.mobile} />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>

              {/* Password */}
              <div className="settings-card">
                <h2>Change Password</h2>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" placeholder="Enter new password" />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>

              {/* Notifications */}
              <div className="settings-card">
                <h2>Notification Preferences</h2>
                <div className="toggle-group">
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Order updates</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Promotional emails</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" />
                    <span>Product recommendations</span>
                  </label>
                  <label className="toggle-item">
                    <input type="checkbox" defaultChecked />
                    <span>Newsletter</span>
                  </label>
                </div>
                <button className="btn-primary">Save Preferences</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;