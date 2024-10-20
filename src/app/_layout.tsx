import { Stack } from "expo-router"; // Importing the Stack component from expo-router for navigation

export default function RootLayout() {
    return (
        <Stack>
            {/* Define the "Shop" screen in the stack */}
            {/* The header will be shown and the title will be "Shop" */}
            <Stack.Screen 
                name="(shop)" 
                options={{ headerShown: false, title: 'Shop' }} 
            />

            {/* Define the "Categories" screen in the stack */}
            {/* The header will be shown and the title will be "Categories" */}
            <Stack.Screen 
                name="categories" 
                options={{ headerShown: false, title: 'Categories' }} 
            />

            {/* Define the "Product" screen in the stack */}
            {/* The header will be shown and the title will be "Product" */}
            <Stack.Screen 
                name="product" 
                options={{ headerShown: true, title: 'Product' }} 
            />

            {/* Define the "Shopping Cart" screen */}
            {/* This screen will be presented as a modal with the title "Shopping Cart" */}
            <Stack.Screen 
                name="cart" 
                options={{ presentation: 'modal', title: 'Shopping Cart' }} 
            />

            {/* Define the "Auth" screen */}
            {/* The header will be shown but no title is explicitly set here */}
            <Stack.Screen 
                name="auth" 
                options={{ headerShown: true }} 
            />
        </Stack>
    );
}
