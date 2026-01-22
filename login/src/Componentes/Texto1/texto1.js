import { StyleSheet, Text, View } from 'react-native';

const Texto1 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar sesión</Text>
      <Text style={styles.descripcion}>
        Introduce tu correo electrónico y contraseña para iniciar sesión en esta aplicación
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 3,
    fontFamily: 'verdana'
  },
});

export default Texto1;
