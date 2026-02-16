import { createContext, useState } from "react";

const Context = createContext();

export const Provider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(true); // Estado inicial de isLoged es false
  const [emailLogged, setEmailLogged] = useState({}); // Estado inicial de isLoged es false
  const [publishInfo, setPublishInfo] = useState({
    title: "",
    user: "", 
    valoration: "",
    description: "",
    type: "",
    coords: "",
  });
  const [searchUrl, setSearchUrl] = useState('');
  return (
    <Context.Provider
      value={{ isLoged, setIsLoged, publishInfo, setPublishInfo, emailLogged, setEmailLogged, searchUrl, setSearchUrl }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
