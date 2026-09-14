import { FlatList, ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCatalog } from "../hooks/useCatalog";
import ProductCard from "../components/productCard";
import ErrorState from "../components/errorState";

export default function CatalogScreen({ navigation }) {
  const { products, isLoading, isError, isEmpty, fetchNextPage, retry } = useCatalog();

  if (isError) {
    return <ErrorState message="Failed to load catalog." onRetry={retry} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && products.length === 0 ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2e7d32" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("Detail", { id: item.id })}
            />
          )}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isEmpty ? <ErrorState message="No products found." onRetry={retry} /> : null
          }
          ListFooterComponent={
            isLoading && products.length > 0 ? (
              <ActivityIndicator style={styles.footerLoader} size="small" />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footerLoader: { padding: 20 }
});
