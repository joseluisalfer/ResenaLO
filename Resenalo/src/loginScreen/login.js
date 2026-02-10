import { StyleSheet, View, Text } from 'react-native';
import Banner from '../Componentes/Banner/Banner';
import PedirDatos from '../Componentes/SetData/setData';
import Registrarse from '../Componentes/RegisterButton/registerButton';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Banner/>
      <Text style={styles.titulo}>Iniciar sesión</Text>
      <Text style={styles.descripcion}>
        Introduce tu correo electrónico y contraseña para iniciar sesión en esta aplicación
      </Text>
      <PedirDatos/>
      <Text style={styles.titulo}>Crear una cuenta</Text>
      <Text style={styles.descripcion}>
        Crea tu cuenta para poder registrarte en ReseñaLo y descubrir nuevos lugares.
      </Text>
      <Registrarse navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20, // Añadido para el espaciado
    justifyContent: 'flex-start', // Alinea todo hacia la parte superior
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,  // Añadir un pequeño margen superior para los títulos
  },
  descripcion: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'verdana',
  },
});

export default Login;
