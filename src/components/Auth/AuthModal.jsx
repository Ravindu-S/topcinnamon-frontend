import { useState } from 'react';
import { FaTimes, FaGoogle, FaFacebook, FaReddit } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, mode = 'signin' }) {
  const [authMode, setAuthMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: ''
  });
  const [error, setError] = useState('');  // Add this line

  const { login, signup } = useAuth();  // Add this line

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === 'signin') {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        onClose();
        setFormData({ email: '', password: '', firstName: '', lastName: '', mobile: '' });
      } else {
        setError(result.error);
      }
    } else {
      const result = await signup(formData);
      if (result.success) {
        onClose();
        setFormData({ email: '', password: '', firstName: '', lastName: '', mobile: '' });
      } else {
        setError(result.error || 'Signup failed');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    alert(`${provider} login will be implemented later`);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="auth-header">
          <h2>{authMode === 'signin' ? 'Welcome Back' : 'Join Us'}</h2>
          <p>
            {authMode === 'signin' 
              ? 'Sign in to continue your journey' 
              : 'Create your account and explore'}
          </p>
        </div>


        {error && <div className="auth-error">{error}</div>}

        {/* Social Login Buttons */}
        <div className="social-login">
          <button 
            className="social-btn google"
            onClick={() => handleSocialLogin('Google')}
          >
            <FaGoogle /> Continue with Google
          </button>
          <button 
            className="social-btn facebook"
            onClick={() => handleSocialLogin('Facebook')}
          >
            <FaFacebook /> Continue with Facebook
          </button>
          <button 
            className="social-btn reddit"
            onClick={() => handleSocialLogin('Reddit')}
          >
            <FaReddit /> Continue with Reddit
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="form-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {authMode === 'signup' && (
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-submit-btn">
            {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div className="auth-toggle">
          {authMode === 'signin' ? (
            <p>
              New to Cinnamon Miracle? 
              <span onClick={() => {
                setAuthMode('signup');
                setError('');
              }}> Sign Up</span>
            </p>
          ) : (
            <p>
              Already a member? 
              <span onClick={() => {
                setAuthMode('signin');
                setError('');
              }}> Sign In</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;