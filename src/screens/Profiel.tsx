import { View, Text, TouchableOpacity } from "react-native";

export default function Profiel({ setIsAuthenticated }: any) {
  return (
    <View>
      <Text>Profiel</Text>
      <TouchableOpacity
        onPress={() => {
          //Logout logica komt hier momenteel gewoon state update
          setIsAuthenticated(false);
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
