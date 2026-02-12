import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../../assets/i18n/index';
const PedirDatos = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const handleOnpress = () => {
    if (email === '' || password === '') {
      alert('Datos en blanco.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.space}>
        <TextInput
          style={styles.inputs}
          placeholder="email@email.com"
          onChangeText={(newText) => setEmail(newText)}
          value={email}
        />
      </View>
      <View style={styles.space}>
        <TextInput
          style={styles.inputs}
          placeholder="password"
          onChangeText={(newText) => setPassword(newText)}
          secureTextEntry={true}
          value={password}
        />
      </View>
      <View style={styles.space}>
        <Pressable style={styles.buttom} onPress={handleOnpress}>
          <Text style={styles.text_buttom}>{t("loginScreen.login")}</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '80%',
        }}>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
        <Text style={{ marginHorizontal: 8 }}>o</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  inputs: {
    borderRadius: 10,
    borderWidth: 2,
    height: 50,
    width: 300,
    padding: 15,
    borderColor: '#D1D1D1',
    fontSize: 15,
  },
  space: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

export default PedirDatos;
