
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/loginScreen/login'
import Register from './src/registerScreen/register'
import Main from './src/Main';
const Stack = createStackNavigator();
const App = () => (
  <Main />
);
export default App;

{/* <NavigationContainer>
    <Stack.Navigator options="false">
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  </NavigationContainer>*/}