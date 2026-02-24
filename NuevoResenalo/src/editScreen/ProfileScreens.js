import { createStackNavigator } from "@react-navigation/stack";
import Profile from "../mainScreens/Profile";
import EditProfile from "../editScreen/EditProfile";
import Place from "../placeScreens/Place";

const Stack = createStackNavigator();

/**
 * ProfileStack: Handles navigation for the profile section.
 * Includes the main profile view, detailed place reviews,
 * and a modal-based editing screen.
 */
const ProfileScreen = () => (
  <Stack.Navigator>
    {/* Primary Navigation Group */}
    <Stack.Group>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Place"
        component={Place}
        options={{ headerShown: false }}
      />
    </Stack.Group>

    {/* Modal Navigation Group: specifically for editing profile 
        to provide a "slide-up" animation on iOS and Android. */}
    <Stack.Group screenOptions={{ presentation: "modal" }}>
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false, // Set to false since EditProfile handles its own UI
        }}
      />
    </Stack.Group>
  </Stack.Navigator>
);

export default ProfileScreen;
