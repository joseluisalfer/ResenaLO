import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import Profile from '../mainScreens/Profile'; 
import EditProfile from '../editScreen/EditProfile'; 
import Place from '../placeScreens/Place';

const Stack = createStackNavigator(); 

const ProfileScreen = () => ( 
  <Stack.Navigator>
    {/* Grupo para las pantallas principales */}
    <Stack.Group>
      <Stack.Screen 
        name="Profile" 
        component={Profile} 
        options={{ headerShown: false }} 
      />
    </Stack.Group>

    {/* Grupo para la pantalla Place */}
    <Stack.Group>
      <Stack.Screen 
        name="Place" 
        component={Place} 
        options={{ headerShown: false }} 
      />
    </Stack.Group>

    {/* Grupo para la pantalla de edición, con presentación modal */}
    <Stack.Group screenOptions={{ presentation: 'modal' }}> 
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile} 
        options={{ headerShown: true, headerMode: 'none' }} 
      /> 
    </Stack.Group> 
  </Stack.Navigator> 
); 

export default ProfileScreen;
