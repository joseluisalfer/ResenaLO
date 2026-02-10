import { StyleSheet, View, Text } from 'react-native';
import Banner from '../Componentes/Banner/Banner';
import PedirDatos from '../Componentes/Buttons/SetData/setData';
import Registrarse from '../Componentes/Buttons/RegisterButton/registerButton';
import { useTranslation } from 'react-i18next';
import '../../assets/i18n/index';
import Idioms from '../Componentes/Buttons/Idioms/idioms';
const Login = ({ navigation }) => {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Banner />
      <Text style={styles.titulo}>{t('componente1.iniciarSesion')}</Text>
      <Text style={styles.descripcion}>
        {t('component1.encabezado')}
      </Text>
      <PedirDatos />
      <Text style={styles.titulo}>{t('componente1.createAccount')}</Text>
      <Text style={styles.descripcion}>
        {t('componente1.TextAcount')}
      </Text>
      <Registrarse navigation={navigation} />
      <Idioms navigation={navigation}></Idioms>
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
