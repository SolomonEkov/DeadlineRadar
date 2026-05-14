import { View, Text, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../Firestore/FirebaseConfig";

export default function Profile() {
  return (
    <View>
      <Text>Profiel</Text>
      <TouchableOpacity
        onPress={() => {
          signOut(auth);
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
