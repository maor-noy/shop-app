import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for icons

export default function CategoryLayout() {
    return (
        <Stack>
            <Stack.Screen 
                name="[slug]" // Dynamic route screen
                options={({ navigation }) => ({
                    headerShown: true, // Show the header
                    // Custom back button in the header
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                })}
            />
        </Stack>
    );
}
