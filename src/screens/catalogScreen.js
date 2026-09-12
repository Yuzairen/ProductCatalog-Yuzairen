import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProducts } from "../api/products";

export default function CatalogScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProducts(0)
      .then((res) => setData(res.products))
      .catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Found {data ? data.length : 0} products!</Text>
    </SafeAreaView>
  );
}
