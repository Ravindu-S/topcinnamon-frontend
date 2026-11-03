const BASE_URL = 'http://localhost:8080';  // Your Spring Boot port

export const getProducts = async () => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const getProductsByCategory = async (category) => {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products by category');
    }
    return response.json();
};