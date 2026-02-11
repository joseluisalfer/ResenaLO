import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./src/loginScreen/login";

import Register from "./src/registerScreen/register";
import Language from "./src/Componentes/language/language";
import Main from './src/Main'
const Stack = createStackNavigator();
const App = () => (
  <Main/>
);
export default App;
