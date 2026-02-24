import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useContext, useEffect } from 'react';
import Context from './Context/Context'; 
import Login from './loginScreen/login';
import Register from './registerScreen/Register';
import Main from './Main'; 

const Stack = createStackNavigator();

/**
 * Main Entry Point: Handles Auth Flow Navigation.
 * Switches between the Auth Stack (Login/Register) and the App Stack (Main)
 * based on the global isLoged state.
 */
const App = () => {
  const { isLoged } = useContext(Context); 

  // Effect to handle navigation changes when login state updates
  useEffect(() => {
    // Logic for auth state side-effects can be added here if needed
  }, [isLoged]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoged ? (
          /* App Stack: Only accessible when user is authenticated */
          <Stack.Screen 
            name="Main" 
            component={Main} 
            options={{ headerShown: false }} 
          />
        ) : (
          /* Auth Stack: Accessible when user is signed out */
          <>
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={Register} 
              // Header is shown by default for Register to provide a back button to Login
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;