import { createContext, useState } from "react";

const Context = createContext();

export const Provider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(true); // Estado inicial de isLoged es false
  const [emailLogged, setEmailLogged] = useState(true); // Estado inicial de isLoged es false
  const [publishInfo, setPublishInfo] = useState({
    title: "",
    user: "", // Aquí puedes obtener el usuario de alguna forma, tal vez del contexto o autenticación
    valoration: "",
    description: "",
    type: "",
    coords: "",
  });
  return (
    <Context.Provider
      value={{ isLoged, setIsLoged, publishInfo, setPublishInfo }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
//oscarmartorellg@gmail.com
