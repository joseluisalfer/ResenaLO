import { createContext, useState } from "react";
// Importamos Appearance para detectar el tema del sistema (opcional pero recomendado)
import { Appearance } from "react-native";

const Context = createContext();

// Definimos los colores fuera para que el código sea limpio
const themes = {
  light: {
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "black",
    primary: "#007AFF",
    border: "#D1D1D1",
  },
  dark: {
    background: "#121212",
    card: "#1E1E1E",
    text: "white",
    primary: "#0A84FF",
    border: "#333333",
  }
};

export const Provider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(false);
  const [emailLogged, setEmailLogged] = useState({});
  const [publishInfo, setPublishInfo] = useState({
    title: "", user: "", valoration: "", description: "", type: "", coords: "",
  });
  const [searchUrl, setSearchUrl] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);

  // --- NUEVA LÓGICA DE TEMA ---
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
  const theme = isDark ? themes.dark : themes.light;

  const toggleTheme = () => setIsDark(!isDark);
  // ----------------------------

  return (
    <Context.Provider
      value={{
        isLoged, setIsLoged,
        publishInfo, setPublishInfo,
        emailLogged, setEmailLogged,
        searchUrl, setSearchUrl,
        selectedFriend, setSelectedFriend,
        theme, isDark, toggleTheme
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;