import { StyleSheet, View, useWindowDimensions } from 'react-native';

import Banner from '../Componentes/Banner/Banner';
import Texto1 from '../Componentes/Texto1/texto1';
import PedirDatos from '../Componentes/PedirDatos/pedridatos';
import Texto2 from '../Componentes/Texto2/Texto2';
import Registrarse from '../Componentes/BotonRegistrar/registrarse';

const Login = ({ navigation }) => {
  const { width, height } = useWindowDimensions();

  // Ejemplos de "porcentajes" adaptativos
  const layout = {
    bannerHeight: height * 0.22,
    contentWidth: width * 0.9,
    inputWidth: width * 0.85,
    buttonWidth: width * 0.85,
    spacing: height * 0.02,
    titleSize: width * 0.06,
    textSize: width * 0.04,
  };

  return (
    <View style={styles.container}>
      <Banner layout={layout} />
      <Texto1 layout={layout} />
      <PedirDatos layout={layout} />
      <Texto2 layout={layout} />
      <Registrarse navigation={navigation} layout={layout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Login;
