import { useCallback, useEffect, useState } from "react";
import { fetchProducts, searchProducts } from "../api/products";

export default function useCatalog(searchQuery = '') {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadProducts = useCallback(async (currentSkip, isLoadMore = false, isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else if (!isLoadMore) setIsFetchingMore(true);
      else setIsLoading(true);

      setIsError(false);

      // Decide which API endpoint to hit based on if there is a search query
      const data = searchQuery ? await searchProducts(searchQuery, currentSkip) : await fetchProducts(currentSkip);

      // Safely extract products and total, falling back to empty arrays/0 if the API acts up
      const fetchedProducts = data?.products || [];
      const total = data?.total || 0;

      if (isLoadMore) {
        setProducts(prev => {
          const combined = [...prev, ...fetchedProducts];
          return Array.from(new Map(combined.map(item => [item.id, item])).values());
        });
      } else {
        setProducts(fetchedProducts);
      }

      // Check if we have reached the end of the database
      if (currentSkip + fetchedProducts.length >= total) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsFetchingMore(false);
    }
  }, [searchQuery]);

  // Re-run the fetch from page 0 anytime the searchQuery changes
  useEffect(() => {
    setSkip(0);
    loadProducts(0);
  }, [loadProducts]);

  // Triggered by the FlatList when the user scrolls to the bottom
  const fetchNextPage = () => {
    if (!isLoading && !isFetchingMore && hasMore && !isError && !isRefreshing) {
      const nextSkip = skip + 20;
      setSkip(nextSkip);
      loadProducts(nextSkip, true);
    }
  };

  // Triggered by the ErrorState refresh button
  const refresh = () => {
    setSkip(0);
    loadProducts(0, false, true);
  };

  // Calculate the empty state dynamically (safeguarded with optional chaining)
  const isEmpty = !isLoading && !isError && products?.length === 0;

  return { products, isLoading, isFetchingMore, isRefreshing, isError, isEmpty, fetchNextPage, refresh };
}