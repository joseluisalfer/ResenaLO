import Main from "./src/Main";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/loginScreen/login'
import Register from './src/registerScreen/register'

const Stack = createStackNavigator();
const App = () => (
<Main />
);
export default App;