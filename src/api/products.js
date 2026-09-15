const Base_URL = "https://dummyjson.com/products";

export const fetchProducts = async (skip = 0, limit = 20) => {
    try {
        const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error; // Throwing allows the UI to catch and display the error state later
    }
}

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product details');
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const searchProducts = async (query, skip = 0, limit = 20) => {
    try {
        const response = await fetch(`${BASE_URL}/search?q=${query}&limit=${limit}&skip=${skip}`);
        if (!response.ok) throw new Error('Failed to search products');
        return await response.json();
    } catch (error) {
        console.error("Search API error:", error);
        throw error;
    }
};