import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home";
import SubjectsScreen from "../screens/Subjects";
import TasksScreen from "../screens/Tasks";
import ProfileScreen from "../screens/Profile";

const Tab = createBottomTabNavigator();
const tabIcons: Record<
  string,
  [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]
> = {
  Home: ["home", "home-outline"],
  Vakken: ["book", "book-outline"],
  Taken: ["checkmark-circle", "checkmark-circle-outline"],
  Profiel: ["person", "person-outline"],
};

export default function TabNavigator({ setIsAuthenticated }: any) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          const [active, inactive] = tabIcons[route.name] ?? [
            "home",
            "home-outline",
          ];
          const iconName = focused ? active : inactive;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Vakken" component={SubjectsScreen} />
      <Tab.Screen name="Taken" component={TasksScreen} />
      <Tab.Screen name="Profiel" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
