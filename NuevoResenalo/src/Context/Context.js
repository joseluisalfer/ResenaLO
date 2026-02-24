import { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { postData } from "../services/Services";  // Asegúrate de importar la función postData

const Context = createContext();

const themes = {
  light: {
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "black",
    primary: "#2654d1",
    border: "#D1D1D1",
  },
  dark: {
    background: "#121212",
    card: "#1E1E1E",
    text: "white",
    primary: "#2654d1",
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
  const [isDark, setIsDark] = useState(
    emailLogged?.results?.theme === 'dark' ? true : false
  );

  const theme = isDark ? themes.dark : themes.light;

  const toggleTheme = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);

    // Realizar el POST para actualizar el tema en la base de datos
    try {
      const response = await postData('http://44.213.235.160:8080/resenalo/updateTheme', {
        email: emailLogged?.results?.email, // Asumiendo que el email está en emailLogged.results.email
        theme: newTheme,
      });

      if (response) {
        console.log('Tema actualizado correctamente en la base de datos');
      }
    } catch (error) {
      console.error('Error al actualizar el tema:', error);
    }
  };
  // ----------------------------

  useEffect(() => {
    // Verificar y actualizar el estado de isDark cuando emailLogged cambia
    if (emailLogged?.results?.theme) {
      setIsDark(emailLogged.results.theme === 'dark');
    }
  }, [emailLogged]);

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