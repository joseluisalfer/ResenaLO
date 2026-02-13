import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../mainScreens/Home";
import Place from "../placeScreens/addModalReview/ModalReview";
import ListPlace from "./ListPlace";
import Podium from "./Podium";
import AllFriends from "./AllFriends"
import Friend from "./Friend"

const Stack = createStackNavigator();

const App = () => {



    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Place"
                component={Place}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ListPlace"
                component={ListPlace}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Podium"
                component={Podium}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AllFriends"
                component={AllFriends}
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

export default App;
