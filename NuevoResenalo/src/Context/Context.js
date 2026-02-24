import { createContext, useState, useEffect } from "react";
import { postData } from "../services/Services";
import { useTranslation } from "react-i18next";

const Context = createContext();

// Define design tokens for both modes
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
  },
};

/**
 * Global Context Provider: Manages user authentication, theme state,
 * language preferences, and shared publication data.
 */
export const Provider = ({ children }) => {
  const { i18n } = useTranslation();

  // User and Auth State
  const [isLoged, setIsLoged] = useState(false);
  const [emailLogged, setEmailLogged] = useState({});
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Shared Form State (for creating reviews)
  const [publishInfo, setPublishInfo] = useState({
    title: "",
    user: "",
    valoration: "",
    description: "",
    type: "",
    coords: "",
  });

  // Navigation and Search State
  const [searchUrl, setSearchUrl] = useState("");

  // Theme and Language State
  const [language, setLanguage] = useState("en");
  const [isDark, setIsDark] = useState(false);

  const theme = isDark ? themes.dark : themes.light;

  /**
   * Syncs the app state whenever a user logs in or their profile is updated.
   */
  useEffect(() => {
    if (emailLogged?.results) {
      // Sync Theme from user profile
      setIsDark(emailLogged.results.theme === "dark");

      // Sync Language from user profile
      if (emailLogged.results.language) {
        setLanguage(emailLogged.results.language);
        i18n.changeLanguage(emailLogged.results.language);
      }
    }
  }, [emailLogged]);

  /**
   * Toggles between light and dark mode and persists the choice to the database.
   */
  const toggleTheme = async () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);

    try {
      await postData("http://44.213.235.160:8080/resenalo/updateTheme", {
        email: emailLogged?.results?.email,
        theme: newTheme,
      });
    } catch (error) {
      // Handled silently to avoid interrupting user flow
    }
  };

  /**
   * Updates the app language via i18next and persists the choice to the database.
   */
  const updateLanguage = async (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);

    try {
      await postData("http://44.213.235.160:8080/resenalo/updateLanguage", {
        email: emailLogged?.results?.email,
        language: selectedLanguage,
      });
    } catch (error) {
      // Handled silently
    }
  };

  return (
    <Context.Provider
      value={{
        isLoged,
        setIsLoged,
        publishInfo,
        setPublishInfo,
        emailLogged,
        setEmailLogged,
        searchUrl,
        setSearchUrl,
        selectedFriend,
        setSelectedFriend,
        theme,
        isDark,
        toggleTheme,
        language,
        setLanguage,
        updateLanguage,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
