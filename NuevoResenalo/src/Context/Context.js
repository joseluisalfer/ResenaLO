import { createContext, useState } from "react";

const Context = createContext();

export const Provider = ({ children }) => {
  const [isLoged, setIsLoged] = useState(false); // Estado inicial de isLoged es false

  return (
    <Context.Provider value={{ isLoged, setIsLoged }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
