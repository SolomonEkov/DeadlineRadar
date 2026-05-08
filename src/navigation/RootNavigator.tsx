import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";

export default function RootNavigator() {
  // Tijdelijk hardcoded voor testen
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
