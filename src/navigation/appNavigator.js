import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import CatalogScreen from "../screens/catalogScreen";
import DetailScreen from "../screens/detailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Catalog">
                <Stack.Screen
                    name="Catalog"
                    component={CatalogScreen}
                    options={{ title: 'Product Catalog' }}
                />
                <Stack.Screen
                    name="Detail"
                    component={DetailScreen}
                    options={{ title: 'Product Details' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}