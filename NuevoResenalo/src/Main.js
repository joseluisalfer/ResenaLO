import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./placeScreens/PlaceStacks";
import Publish from "./mainScreens/Publish";
import Find from "./mainScreens/stackNotification/StackNotification";
import Profile from "./editScreen/ProfileScreens";
import Context from "./Context/Context"; 

const Tab = createBottomTabNavigator();

/**
 * Main Component: Configures the Bottom Tab Navigation for the app.
 * Dynamically adjusts styles and icons based on the active route and theme.
 */
const Main = () => {
  // Extract theme and isDark from global context
  const { theme, isDark } = useContext(Context);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        // Bar styling
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#fff", // Dark or light background
          borderTopColor: isDark ? "#333" : "#eee",     // Subtle top border
          height: 60,                                   // Bar height
          // 'position: absolute' is omitted to prevent the bar from floating over content
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Assign icon based on route name
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Publish") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Find") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Icon color when selected
        tabBarActiveTintColor: "#2654d1", 
        // Icon color when NOT selected
        tabBarInactiveTintColor: isDark ? "#666" : "#BDC3C7", 
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Publish" component={Publish} />
      <Tab.Screen name="Find" component={Find} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Main;