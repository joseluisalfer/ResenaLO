import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importa las pantallas
import Profile from "../mainScreens/Profile";  // Verifica que la ruta esté correcta
import EditProfile from "./EditProfile";  // Verifica que la ruta esté correcta

const Stack = createStackNavigator();

const ProfileScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile">
        {/* Pantalla de perfil */}
        <Stack.Screen
          name="Profile"  // Asegúrate de que el nombre de esta pantalla sea el que usas para navegar
          component={Profile}
          options={{ headerShown: false }} // Si no necesitas encabezado
        />

        {/* Pantalla de editar perfil */}
        <Stack.Screen
          name="EditProfile"  // El nombre que usarás para navegar a esta pantalla
          component={EditProfile}
          options={{ headerShown: false }} // Si no necesitas encabezado
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProfileScreen;
