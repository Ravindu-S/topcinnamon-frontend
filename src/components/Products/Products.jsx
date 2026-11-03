import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Products.css';

function Products({ category }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/products/category/${category}`);
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    // Function to get the unit based on category
    const getUnit = () => {
        return category === 'oil' ? 'per 100ml' : 'per 100g';
    };

    if (loading) return null;
    if (error) return null;

    return (
        <div className="products-grid">
            {products.map(product => (
                <div 
                    key={product.id} 
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="product-image">
                        <img 
                            src={`/images/${product.imageFilename}`} 
                            alt={product.name}
                            onError={(e) => {
                                e.target.src = '/images/default.jpg';
                            }}
                        />
                    </div>
                    <div className="product-info">
                        <h3>
                            {product.name}
                            <div className="dotted-line"></div>
                            <span className="price-with-unit">
                                Rs. {product.price.toFixed(2)}
                                <small className="unit"> ({getUnit()})</small>
                            </span>
                        </h3>
                        <p className="product-description">{product.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Products;