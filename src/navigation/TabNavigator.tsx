import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import VakkenScreen from "../screens/Vakken";
import TakenScreen from "../screens/Taken";
import ProfielScreen from "../screens/Profiel";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ setIsAuthenticated }: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Vakken" component={VakkenScreen} />
      <Tab.Screen name="Taken" component={TakenScreen} />
      <Tab.Screen name="Profiel">
        {(props) => (
          <ProfielScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
