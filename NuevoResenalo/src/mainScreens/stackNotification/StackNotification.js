import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import FindUser from "../FindUser";
import Friend from "../../placeScreens/Friend";
import Place from "../../placeScreens/Place";
import Review from "../../placeScreens/addModalReview/Review";

const Stack = createStackNavigator();

/**
 * StackNotification: Manages the navigation flow for social interactions.
 * It allows users to search for others, view friend profiles, explore 
 * places they've visited, and read specific reviews.
 */
const StackNotification = () => {
    return (
        <Stack.Navigator initialRouteName="Find">
            {/* Entry point: User search and discovery */}
            <Stack.Screen
                name="Find"
                component={FindUser}
                options={{ headerShown: false }}
            />

            {/* Detailed view of another user's profile */}
            <Stack.Screen
                name="Friend"
                component={Friend}
                options={{ headerShown: false }}
            />

            {/* View specific details of a place/location */}
            <Stack.Screen
                name="Place"
                component={Place}
                options={{ headerShown: false }}
            />

            {/* Full view of a specific user review */}
            <Stack.Screen
                name="Review"
                component={Review}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default StackNotification;