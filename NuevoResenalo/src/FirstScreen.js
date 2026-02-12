import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import Context from './Context/Context'; // Asegúrate de importar Context correctamente
import Login from './loginScreen/login';
import Register from './registerScreen/register';
import Main from './Main'; // Asegúrate de que esta ruta sea correcta

const Stack = createStackNavigator();

const App = () => {
  const { isLoged } = useContext(Context); // Usar el estado global del contexto

  return (
      <NavigationContainer>
        <Stack.Navigator>
          {isLoged ? (
            <Stack.Screen options={{ headerShown: false }} name="Main" component={Main} />
          ) : (
            <>
              <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
