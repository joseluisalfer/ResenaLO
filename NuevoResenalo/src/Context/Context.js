import { createContext, useState, useEffect } from "react";
import { postData } from "../services/Services";  // Asegúrate de importar la función postData
import { useTranslation } from 'react-i18next';

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

  const { i18n } = useTranslation();

  // New state for language
  const [language, setLanguage] = useState(emailLogged?.results?.language || 'en');

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

  // Function to update the language
  const updateLanguage = async (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);  // Update the i18n language

    // Send a POST request to update the language in the database
    try {
      const response = await postData('http://44.213.235.160:8080/resenalo/updateLanguage', {
        email: emailLogged?.results?.email, // Asumiendo que el email está en emailLogged.results.email
        language: selectedLanguage,
      });

      if (response) {
        console.log('Idioma actualizado correctamente en la base de datos');
      }
    } catch (error) {
      console.error('Error al actualizar el idioma:', error);
    }
  };

  useEffect(() => {
    // Update language if the emailLogged state changes
    if (emailLogged?.results?.language) {
      setLanguage(emailLogged.results.language);
      i18n.changeLanguage(emailLogged.results.language); // Change the language in i18n
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
        theme, isDark, toggleTheme,
        language, setLanguage, updateLanguage  // Add language and updateLanguage to the context
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;