import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Place from "../Place";
import Review from "./Review";
import DeletePlace from "./DeletePlace";

const Stack = createStackNavigator();

/**
 * ReviewStack Component: Manages the navigation flow for a specific location.
 * Uses a modal presentation for secondary actions like viewing details
 * or initiating a deletion to keep the user within the context of the place.
 */
const ReviewStack = () => (
  <Stack.Navigator>
    {/* Standard Screen Group */}
    <Stack.Group>
      <Stack.Screen
        name="Place"
        component={Place}
        options={{ headerShown: false }}
      />
    </Stack.Group>

    {/* Modal Presentation Group: Slide-up effect for iOS/Android */}
    <Stack.Group screenOptions={{ presentation: "modal", headerShown: false }}>
      <Stack.Screen name="Review" component={Review} />
      <Stack.Screen name="DeletePlace" component={DeletePlace} />
    </Stack.Group>
  </Stack.Navigator>
);

export default ReviewStack;
