import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Notification from "../Notification"
import Friend from "../../placeScreens/Friend"

const Stack = createStackNavigator();

const StackNotification = () => {
    return (
        <Stack.Navigator initialRouteName="Notification">
            <Stack.Screen
                name="Notification"
                component={Notification}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Friend"
                component={Friend}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default StackNotification;
