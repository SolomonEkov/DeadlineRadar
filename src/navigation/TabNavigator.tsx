import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import SubjectsScreen from "../screens/Subjects";
import TasksScreen from "../screens/Tasks";
import ProfileScreen from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ setIsAuthenticated }: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Vakken" component={SubjectsScreen} />
      <Tab.Screen name="Taken" component={TasksScreen} />
      <Tab.Screen name="Profiel">
        {(props) => (
          <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
