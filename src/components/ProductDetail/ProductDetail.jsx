import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ProductDetail.css';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../Auth/AuthContext';
import Reviews from '../Reviews/Reviews';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [orderType, setOrderType] = useState('single');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, addToCart } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/products/${id}`);
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const calculatePrice = () => {
        if (!product) return 0;
        const basePrice = product.price * quantity;
        return orderType === 'bulk' ? (basePrice * 0.9).toFixed(2) : basePrice.toFixed(2);
    };

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }
        
        addToCart(product, quantity, orderType);
        alert(`Added ${quantity} ${orderType === 'bulk' ? '(bulk)' : ''} item(s) to cart!`);
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            return;
        }
        
        // Add to cart first
        addToCart(product, quantity, orderType);
        
        // Navigate to checkout using React Router (not window.location)
        navigate('/checkout', { 
            state: { 
                directBuy: true,
                product: {
                    ...product,
                    quantity,
                    orderType
                }
            }
        });
    };

    const getUnit = () => {
        if (product?.name?.toLowerCase().includes('oil')) {
            return 'per 100ml';
        }
        return 'per 100g';
    };
    
    if (loading) return null;
    if (!product) return <div>Product not found</div>;

    return (
        <>
            <div className="product-detail-container">
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                <div className="product-detail">
                    <div className="product-image-container">
                        <img 
                            src={`/images/${product.imageFilename}`} 
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/images/default.jpg';
                            }}
                        />
                    </div>

                    <div className="product-info-container">
                        <h1>{product.name}</h1>
                        
                        <div className="price-section">
                            <span className="price-label">Price:</span>
                            <span className="price-amount">
                                Rs. {calculatePrice()}
                                <small className="unit"> ({getUnit()})</small>
                            </span>
                            {orderType === 'bulk' && (
                                <span className="discount-badge">10% OFF</span>
                            )}
                        </div>

                        <div className="order-options">
                            <div className="order-type">
                                <button 
                                    className={orderType === 'single' ? 'active' : ''}
                                    onClick={() => setOrderType('single')}
                                >
                                    Single Order
                                </button>
                                <button 
                                    className={orderType === 'bulk' ? 'active' : ''}
                                    onClick={() => {
                                        setOrderType('bulk');
                                        setQuantity(10);
                                    }}
                                >
                                    Bulk Order (10+)
                                </button>
                            </div>

                            <div className="quantity-control">
                                <button 
                                    onClick={() => setQuantity(Math.max(orderType === 'bulk' ? 10 : 1, quantity - 1))}
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        setQuantity(orderType === 'bulk' ? Math.max(10, val) : Math.max(1, val));
                                    }}
                                />
                                <button onClick={() => setQuantity(quantity + 1)}>
                                    +
                                </button>
                            </div>
                        </div>

                        <p className="product-description">{product.description}</p>
                        
                        <div className="stock-info">
                            Stock: {product.stock_quantity} units available
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="btn-primary"
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity <= 0}
                            >
                                Add to Cart
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={handleBuyNow}
                                disabled={product.stock_quantity <= 0}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <Reviews productId={product.id} />
            </div>

            <AuthModal 
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                mode="signin"
            />
        </>
    );
}

export default ProductDetail;