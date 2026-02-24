import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import FindUser from "../FindUser";
import Friend from "../../placeScreens/Friend"
import Place from "../../placeScreens/Place"

const Stack = createStackNavigator();

const StackNotification = () => {
    return (
        <Stack.Navigator initialRouteName="Find">
            <Stack.Screen
                name="Find"
                component={FindUser}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Friend"
                component={Friend}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Place"
                component={Place}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default StackNotification;
