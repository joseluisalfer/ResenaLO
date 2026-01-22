import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Screen1 from './src/screens/screen1/screen1'
import Screen2 from './src/screens/screen2/screenRegistro'
const Stack = createStackNavigator();
const App = () => (
  <NavigationContainer>
    <Stack.Navigator options="false">
      <Stack.Screen options={{headerShown: false}} name="Screen 1" component={Screen1} />
      <Stack.Screen name="Screen 2" component={Screen2} />
    </Stack.Navigator>
  </NavigationContainer>
);
export default App;
