import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import Profile from '../mainScreens/Profile'; 
import EditProfile from '../editScreen/EditProfile'; 
 
const Stack = createStackNavigator(); 
 
const ProfileScreen = () => ( 
    <Stack.Navigator> 
      <Stack.Group> 
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/> 
      </Stack.Group> 
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