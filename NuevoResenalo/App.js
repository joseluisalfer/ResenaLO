import { Provider } from './src/Context/Context'; // Importa el Contexto
import FirstScreen from './src/FirstScreen'; // Asegúrate de que esta ruta sea correcta

const App = () => {
  return (
    <Provider>
      <FirstScreen /> 
    </Provider>
  );
};

export default App;
