import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable
} from 'react-native';
import Banner from '../Componentes/Banner/Banner';
import { useTranslation } from 'react-i18next'
import '../../assets/i18n/index';
const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birth, setBirth] = useState('');
  const { t } = useTranslation();

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

      <Text style={styles.title}>{t("registerScreen.createAccount")}</Text>
      <Text style={styles.subtitle}>
       {t("registerScreen.footer")}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={t("registerScreen.email")}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder={t("registerScreen.password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder={t("registerScreen.confirm")}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TextInput
        style={styles.input}
        placeholder={t("registerScreen.user")}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder={t("registerScreen.date")}
        value={birth}
        onChangeText={setBirth}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t("registerScreen.register")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',
    marginTop: 20,  
  },
  banner: {
    marginBottom: -20,
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
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 45,  
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,  
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 12,  
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
