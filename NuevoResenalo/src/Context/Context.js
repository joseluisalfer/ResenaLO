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
  return (
    <Context.Provider
      value={{ isLoged, setIsLoged, publishInfo, setPublishInfo, emailLogged, setEmailLogged }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
