import { StyleSheet, Text, View } from 'react-native';

const Texto2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crear una cuenta</Text>
      <Text style={styles.descripcion}>
        Crea tu cuenta para poder registrarte en ReseñaLo y descubrir nuevos lugares.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
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

export default Texto2;
