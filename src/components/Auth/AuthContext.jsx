import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Temporary user credentials (remove later)
const TEMP_USER = {
  email: 'test@cinnamonmiracle.com',
  password: 'test123',
  firstName: 'Test',
  lastName: 'User',
  mobile: '0771234567'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const login = async (email, password) => {
    try {
      // Check if test credentials are being used
      if (email === 'test@cinnamonmiracle.com' && password === 'test123') {
        console.log('Using test credentials');
        const userData = {
          email: TEMP_USER.email,
          firstName: TEMP_USER.firstName,
          lastName: TEMP_USER.lastName,
          mobile: TEMP_USER.mobile
        };
        setUser(userData);
        
        // Load cart from database
        await loadCartFromDatabase(userData.email);
        
        return { success: true };
      }

      const response = await fetch('http://localhost:8080/api/auth/authenticateuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          isSignup: false
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Fetch user details
        const userResponse = await fetch(`http://localhost:8080/api/auth/users`);
        const users = await userResponse.json();
        const userData = users.find(u => u.email === email);
        
        if (userData) {
          const userInfo = {
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobile: userData.mobile
          };
          setUser(userInfo);
          
          // Load cart from database
          await loadCartFromDatabase(userInfo.email);
        }
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to test credentials if backend is not available
      if (email === 'test@cinnamonmiracle.com' && password === 'test123') {
        console.log('Backend unavailable, using test credentials fallback');
        setUser({
          email: TEMP_USER.email,
          firstName: TEMP_USER.firstName,
          lastName: TEMP_USER.lastName,
          mobile: TEMP_USER.mobile
        });
        return { success: true };
      }
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/authenticateuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          mobile: userData.mobile,
          gender: userData.gender || 'Not specified',
          location: userData.location || 'Not specified',
          isSignup: true
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setUser({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          mobile: userData.mobile
        });
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const loadCartFromDatabase = async (userEmail) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/database/user/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        // Convert database cart to frontend format
        const cartItems = data.map(item => ({
          id: item.productId,
          name: item.productName,
          price: item.unitPrice,
          imageFilename: item.imageFilename,
          quantity: item.quantity,
          orderType: item.orderType,
          addedAt: item.addedAt
        }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (product, quantity, orderType) => {
    // Update local state immediately for UI responsiveness
    const existingItem = cart.find(item => 
      item.id === product.id && item.orderType === orderType
    );

    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id && item.orderType === orderType
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
      
      // Save to database
      if (user) {
        await saveCartToDatabase(product, existingItem.quantity + quantity, orderType);
      }
    } else {
      const newCart = [...cart, { 
        ...product, 
        quantity, 
        orderType,
        addedAt: new Date()
      }];
      setCart(newCart);
      
      // Save to database
      if (user) {
        await saveCartToDatabase(product, quantity, orderType);
      }
    }
  };

  const saveCartToDatabase = async (product, quantity, orderType) => {
    try {
      await fetch('http://localhost:8080/api/cart/database/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: user.email,
          productId: product.id,
          productName: product.name,
          imageFilename: product.imageFilename,
          price: product.price,
          quantity: quantity,
          orderType: orderType
        })
      });
    } catch (error) {
      console.error('Error saving to database cart:', error);
    }
  };

  const removeFromCart = async (productId, orderType) => {
    setCart(cart.filter(item => 
      !(item.id === productId && item.orderType === orderType)
    ));
    
    // Remove from database
    if (user) {
      try {
        await fetch(`http://localhost:8080/api/cart/database/remove?userEmail=${user.email}&productId=${productId}&orderType=${orderType}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error removing from database cart:', error);
      }
    }
  };

  const updateCartQuantity = async (productId, orderType, quantity) => {
    setCart(cart.map(item =>
      item.id === productId && item.orderType === orderType
        ? { ...item, quantity }
        : item
    ));
    
    // Update in database
    if (user) {
      try {
        await fetch('http://localhost:8080/api/cart/database/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userEmail: user.email,
            productId: productId,
            orderType: orderType,
            quantity: quantity
          })
        });
      } catch (error) {
        console.error('Error updating database cart:', error);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);
    
    // Clear from database
    if (user) {
      try {
        await fetch(`http://localhost:8080/api/cart/database/clear/${user.email}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error clearing database cart:', error);
      }
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.orderType === 'bulk' ? item.price * 0.9 : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      cart,
      login,
      signup,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};