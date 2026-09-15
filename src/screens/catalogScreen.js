import { useState } from "react";
import { FlatList, ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useCatalog from '../hooks/useCatalog';
import ProductCard from "../components/productCard";
import ErrorState from "../components/errorState";
import useDebounce from "../hooks/useDebounce";
import SearchBar from "../components/searchBar";
import { RefreshControl } from "react-native";

export default function CatalogScreen({ navigation }) {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500); //delay

  const { products, isLoading, isRefreshing, isError, isEmpty, fetchNextPage, refresh } = useCatalog(debouncedSearch);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchInput} onChangeText={setSearchInput} />

      {isError && products.length === 0 ? (
        <ErrorState message="Failed to load catalog." onRetry={refresh} />
      ):isLoading && products.length === 0 ? (
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

          // Pull-to-refresh functionality
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} colors={['#2e7d32']} />
          }
          ListEmptyComponent={
            isEmpty ? <ErrorState message="No products found." onRetry={refresh} /> : null
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
