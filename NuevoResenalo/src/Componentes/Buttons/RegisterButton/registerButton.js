import { StyleSheet, Text, View, Pressable } from 'react-native';

const Registrarse = (props) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => props.navigation.navigate('Register')} style={styles.buttom}>
        <Text style={styles.text_buttom}>Registrarse</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttom: {
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 15,
    height: 50,
    width: 300,
    borderRadius: 10,
  },
  text_buttom: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default Registrarse;
