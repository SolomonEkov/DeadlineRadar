import { View, Text, TouchableOpacity } from "react-native";

export default function Profile({ setIsAuthenticated }: any) {
  return (
    <View>
      <Text>Profiel</Text>
      <TouchableOpacity
        onPress={() => {
          // Logout logic is currently just a state update.
          setIsAuthenticated(false);
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
