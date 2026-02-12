import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Place from '../Place';
import Review from './Review';
import EditPlace from './EditPlace';

const Stack = createStackNavigator();

const ModalReview = () => (
  <Stack.Navigator>
    <Stack.Group>
      <Stack.Screen name="Place" component={Place} options={{ headerShown: false }} />
    </Stack.Group>
    <Stack.Group screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen
        name="Review"
        component={Review}
        options={{ headerShown: true, headerMode: 'none' }}
      />
      <Stack.Screen
        name="EditPlace"
        component={EditPlace}
        options={{ headerShown: true, headerMode: 'none' }}
      />
    </Stack.Group>
  </Stack.Navigator>
);

export default ModalReview; 