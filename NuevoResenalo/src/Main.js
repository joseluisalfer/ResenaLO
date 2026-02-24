import React, { useContext } from "react"; // Importamos useContext
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Home from "./placeScreens/PlaceStacks";
import Publish from "./mainScreens/Publish";
import Find from "./mainScreens/stackNotification/StackNotification";
import Profile from "./editScreen/ProfileScreens";
import Context from "./Context/Context"; // Ajusta la ruta a tu Context

const Tab = createBottomTabNavigator();

const Main = () => {
  // Extraemos theme e isDark del contexto
  const { theme, isDark } = useContext(Context);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        // Estilos de la barra
        tabBarStyle: {
          backgroundColor: isDark ? "#121212" : "#fff", // Fondo oscuro o claro
          borderTopColor: isDark ? "#333" : "#eee",     // Borde superior sutil
          height: 60,                                    // Altura de la barra
          // Quitamos la propiedad 'position: 'absolute'' para evitar que la barra flote sobre el contenido
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Publish") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Find") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Color del icono cuando está seleccionado
        tabBarActiveTintColor: "#2654d1", 
        // Color del icono cuando NO está seleccionado
        tabBarInactiveTintColor: isDark ? "#666" : "#BDC3C7", 
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Publish" component={Publish} />
      <Tab.Screen name="Find" component={Find} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Main;