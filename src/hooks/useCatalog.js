import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../api/products';

export default function useCatalog() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadProducts = useCallback(async (currentSkip, isLoadMore = false) => {
        try {
            if (!isLoadMore) {
                setIsLoading(true);
                setIsError(false);
            }

            const data = await fetchProducts(currentSkip);

            if (isLoadMore) {
                setProducts(prev => [...prev, ...data.products]);
            } else {
                setProducts(data.products);
            }
            
            // Check if we have reached the end of the database
            if (currentSkip + data.products.length >= data.total) {
                setHasMore(false);
            }
        } catch (error) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Initial load when the hook is first used
    useEffect(() => {
        loadProducts(0);
    }, [loadProducts]);

    // Triggered by the FlatList when the user scrolls to the bottom
    const fetchNextPage = () => {
        if (!isLoading && hasMore && !isError) {
            const nextSkip = skip + 20;
            setSkip(nextSkip);
            loadProducts(nextSkip, true);
        }
    };

    // Triggered by the ErrorState retry button
    const retry = () => {
        setSkip(0);
        setHasMore(true);
        loadProducts(0);
    };

    // Calculate the empty state dynamically
    const isEmpty = !isLoading && !isError && products.length === 0;

    return { products, isLoading, isError, isEmpty, fetchNextPage, retry, };

}