import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchProductById } from '../api/products';
import ErrorState from '../components/errorState';

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadDetail = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (isError) return <ErrorState message="Failed to load details." onRetry={loadDetail} />;
  
  if (isLoading || !product) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.rating}>Rating: {product.rating} / 5</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, backgroundColor: '#f0f0f0' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 20, color: '#2e7d32', marginBottom: 10, fontWeight: '600' },
  rating: { fontSize: 16, color: '#666', marginBottom: 20 },
  description: { fontSize: 16, lineHeight: 24, color: '#333' }
});