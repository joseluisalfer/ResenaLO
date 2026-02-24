import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Screen Imports
import HomeScreen from "../mainScreens/Home";
import ModalReview from "../placeScreens/addModalReview/ModalReview"; // Note: This is the nested Stack
import ListPlace from "./ListPlace";
import Podium from "./Podium";
import AllFriends from "./AllFriends";
import Friend from "./Friend";

const Stack = createStackNavigator();

/**
 * MainStack: The primary navigation controller for the application.
 * Most screens have headerShown: false because they implement custom 
 * headers with specific theme support (Back buttons, Trash icons, etc.).
 */
const MainStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        // Optional: Standardizes transitions across the stack
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {/* Primary Landing */}
      <Stack.Screen name="Home" component={HomeScreen} />

      {/* Place Details & Sub-Navigation (Review/Delete) */}
      <Stack.Screen name="Place" component={ModalReview} />

      {/* Exploration & Social Screens */}
      <Stack.Screen name="ListPlace" component={ListPlace} />
      <Stack.Screen name="Podium" component={Podium} />
      <Stack.Screen name="AllFriends" component={AllFriends} />
      <Stack.Screen name="Friend" component={Friend} />
      
    </Stack.Navigator>
  );
};

export default MainStack;