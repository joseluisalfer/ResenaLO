import { StyleSheet, View, Text } from 'react-native';
import Banner from '../Componentes/Banner/Banner';
import SetData from '../Componentes/Buttons/SetData/setData';
import Registrarse from '../Componentes/Buttons/RegisterButton/registerButton';
import { useTranslation } from 'react-i18next';
import '../../assets/i18n/index';
const Login = ({ navigation }) => {

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Banner />
      <Text style={styles.titulo}>{t('loginScreen.login')}</Text>
      <Text style={styles.descripcion}>
        {t('loginScreen.footer')}
      </Text>
      <SetData navigation={navigation} />
      <Text style={styles.titulo}>{t('loginScreen.createAccount')}</Text>
      <Text style={styles.descripcion}>
        {t('loginScreen.textAccount')}
      </Text>
      <Registrarse navigation={navigation} />
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
