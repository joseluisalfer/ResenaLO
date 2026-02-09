import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable
} from 'react-native';
import Banner from '../Componentes/Banner/Banner';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birth, setBirth] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log({ email, password, username, birth });
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Banner/>

      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>
        Introduce tu correo electrónico y contraseña para crear una cuenta:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (DD/MM/AAAA)"
        value={birth}
        onChangeText={setBirth}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',  // Esto coloca los elementos hacia arriba
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
    marginTop: 20,  // Reducir el margen superior para acercar la caja a la parte superior
  },
  banner: {
    marginBottom: -20, // Ajusta la imagen hacia arriba
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10, // Reducir el espacio entre el título y los campos
  },
  input: {
    width: '100%',
    height: 45,  // Reducir la altura de los inputs
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,  // Reducir el margen entre los inputs
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,  // Reducir el padding del botón
    height: 50,
    width: 300,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default Register;
