import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./src/loginScreen/login";
import Register from './src/registerScreen/register'
import Language from './src/Componentes/language/language';
const Stack = createStackNavigator();
const App = () => (
  <NavigationContainer>
    <Stack.Navigator options="false">
      <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
<<<<<<< HEAD
=======
      <Stack.Screen name='Lang' component={Language} />
>>>>>>> c9dae9df850ce935a03c67602e6f7a0079fb1ba3
    </Stack.Navigator>
  </NavigationContainer>
);
export default App;