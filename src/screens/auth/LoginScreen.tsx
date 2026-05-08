import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";

export default function LoginScreen({ navigation, setIsAuthenticated }: any) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>Login</Text>
      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
      />
      <TouchableOpacity
        onPress={() => {
          /* TODO: Firebase auth */
          setIsAuthenticated(true);
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
