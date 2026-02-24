import { Provider } from './src/Context/Context'; // Import the global Context Provider
import FirstScreen from './src/FirstScreen'; // Import the initial screen/navigator

/**
 * Root Component: Entry point of the mobile application.
 * It wraps the entire app within the Context Provider to ensure 
 * global state (theme, auth, etc.) is accessible in all screens.
 */
const App = () => {
  return (
    <Provider>
      <FirstScreen /> 
    </Provider>
  );
};

export default App;