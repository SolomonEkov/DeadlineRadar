import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import { auth } from "../Firestore/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function RootNavigator() {
  // Tijdelijk hardcoded voor testen
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return unsub;
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <TabNavigator setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <AuthNavigator setIsAuthenticated={setIsAuthenticated} />
      )}
    </NavigationContainer>
  );
}
