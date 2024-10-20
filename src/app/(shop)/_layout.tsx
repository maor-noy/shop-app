import { Tabs } from "expo-router"; // Importing Tabs component for tab-based navigation
import { SafeAreaView } from "react-native-safe-area-context"; // Ensures the layout respects the safe area on devices
import { StyleSheet } from "react-native"; // For styling
import React from "react";
import { FontAwesome } from '@expo/vector-icons'; // Importing FontAwesome icons

/**
 * A helper component to render FontAwesome icons in the TabBar.
 *
 * @param {React.ComponentProps<typeof FontAwesome>['name']} props.name - The name of the FontAwesome icon to display.
 * @param {string} props.color - The color for the icon.
 * @returns {JSX.Element} The FontAwesome icon component.
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name']; // Type definition for the icon name
    color: string; // Color for the icon
}) {
    return <FontAwesome size={24} style={{ color: '#34915d' }} {...props} />;
}

const TabsLayout = () => {
    return (
        <SafeAreaView edges={['top']} style={styles.SafeArea}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#1BC464', // Active tab label color (green)
                    tabBarInactiveTintColor: 'gray', // Inactive tab label color
                    tabBarLabelStyle: { fontSize: 16 }, // Style for the tab labels
                    tabBarStyle: {
                        borderTopLeftRadius: 18, // Rounded corners for the tab bar (top-left)
                        borderTopRightRadius: 18, // Rounded corners for the tab bar (top-right)
                        paddingTop: 4, // Adds padding to the top of the tab bar
                    },
                    headerShown: false, // No header for the screens in the tab navigator
                }}
            >
                <Tabs.Screen
                    name="index" // Route name for the screen
                    options={{
                        title: 'Shop', // Label for the tab
                        tabBarIcon(props) {
                            return <TabBarIcon {...props} name="shopping-cart" />; // FontAwesome shopping cart icon
                        },
                    }}
                />
                <Tabs.Screen
                    name="orders" // Route name for the screen
                    options={{
                        title: 'Orders', // Label for the tab
                        tabBarIcon(props) {
                            return <TabBarIcon {...props} name="book" />; // FontAwesome book icon
                        },
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
};

export default TabsLayout;

/**
 * Styles for the SafeAreaView container.
 */
const styles = StyleSheet.create({
    SafeArea: {
        flex: 1, // Ensures the component takes up the full height of the screen
    },
});
