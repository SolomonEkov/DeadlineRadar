import { View, Text, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../Firestore/FirebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView>
      <Text>Profiel</Text>
      <TouchableOpacity
        onPress={() => {
          signOut(auth);
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
