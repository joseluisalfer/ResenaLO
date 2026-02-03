import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import Banner from '../Componentes/Banner/Banner';
import Texto1 from '../Componentes/Texto1/texto1';
import PedirDatos from '../Componentes/PedirDatos/pedridatos';
import Texto2 from '../Componentes/Texto2/Texto2'
import Registrarse from '../Componentes/BotonRegistrar/registrarse'
const Login = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Banner></Banner>
      <Texto1></Texto1>
      <PedirDatos></PedirDatos>
      <Texto2></Texto2>
      <Registrarse navigation={navigation}></Registrarse>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
export default Login;
