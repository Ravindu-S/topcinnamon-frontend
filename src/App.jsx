import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import './App.css';
import Home from './components/Home/Home';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Cart from './components/Cart/Cart';
import Dashboard from './components/Dashboard/Dashboard';  // Add this
import AuthModal from './components/Auth/AuthModal';
import { useAuth } from './components/Auth/AuthContext';
import Checkout from './components/Checkout/Checkout';
import Payment from './components/Payment/Payment';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

// Navbar Component
function Navbar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  const { user, logout, getCartCount } = useAuth();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/products`);
      const allProducts = await response.json();
      
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleProductSelect = () => {
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowUserDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
      if (!event.target.closest('.user-account')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
              About
            </Link>
            <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
              Products
            </Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
              Contact
            </Link>
          </div>

          <div className="nav-right">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              />
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="search-result-card"
                      onClick={handleProductSelect}
                    >
                      <img 
                        src={`/images/${product.imageFilename}`} 
                        alt={product.name}
                        onError={(e) => e.target.src = '/images/default.jpg'}
                      />
                      <div className="search-result-info">
                        <h4>{product.name}</h4>
                        <span className="search-result-price">Rs. {product.price.toFixed(2)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>

            {/* User Account */}
            <div 
              className="user-account"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <button className="account-btn">
                <FaUser className="profile-icon" />
                <span>{user ? user.firstName : 'Account'}</span>
              </button>
              
              {showUserDropdown && (
                <div className="account-dropdown">
                  {user ? (
                    <>
                      <div className="user-info">
                        <p className="user-name">{user.firstName} {user.lastName}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/dashboard" onClick={() => setShowUserDropdown(false)}>
                        Dashboard
                      </Link>
                      <Link to="/cart" onClick={() => setShowUserDropdown(false)}>
                        My Cart
                      </Link>
                      <div className="dropdown-divider"></div>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}>
                        Sign Out
                      </a>
                    </>
                  ) : (
                    <>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleAuthClick('signin');
                      }}>
                        Sign In
                      </a>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleAuthClick('signup');
                      }}>
                        Sign Up
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;