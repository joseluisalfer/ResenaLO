import { createContext, useState } from "react";

const Context = createContext();

export const Provider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(false); // Estado inicial de isLoged es false
  const [emailLogged, setEmailLogged] = useState({}); 
  const [publishInfo, setPublishInfo] = useState({
    title: "",
    user: "",
    valoration: "",
    description: "",
    type: "",
    coords: "",
  });
  const [searchUrl, setSearchUrl] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  return (
    <Context.Provider
      value={{ isLoged, setIsLoged, publishInfo, setPublishInfo, emailLogged, setEmailLogged, searchUrl, setSearchUrl, selectedFriend, setSelectedFriend }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
