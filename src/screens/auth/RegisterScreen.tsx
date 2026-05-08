import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FirebaseConfig";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <Text>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, width: 250, marginVertical: 10 }}
      />

      <TouchableOpacity
        onPress={async () => {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate("Login");
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Text>Create account</Text>
      </TouchableOpacity>
    </View>
  );
}
