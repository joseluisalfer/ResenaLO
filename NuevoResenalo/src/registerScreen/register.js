import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal
} from 'react-native';
import { Button } from 'react-native-paper';
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

  const [verificationCode, setVerificationCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log({ email, password, username, birth });
    setModalVisible(true);
  };

    const handleModalConfirm = () => {
    console.log("Código de verificación confirmado:", verificationCode);
    setModalVisible(false);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("registerScreen.createAccount")}</Text>
      <Text style={styles.subtitle}>
       {t("registerScreen.footer")}
      </Text>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Introduce el código de verificación enviado a su correo electrónico</Text>
            <TextInput
              style={styles.input}
              placeholder="Código de verificacion"
              autoCapitalize="none"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />

            {/* Botón de confirmar que aparece solo si hay texto en el campo */}
            {verificationCode.trim().length > 0 && (
              <Button
                onPress={handleModalConfirm}
                mode="contained"
              >
                Confirmar
              </Button>
            )}

            <Text onPress={() => setModalVisible(false)} mode="outlined" style={styles.cancelButton}>
              Cancelar
            </Text>
          </View>
        </View>

      </Modal>


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
        {/*handleRegister()*/}
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Fondo oscuro para el modal
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",  // Ancho del modal
  },
  cancelButton: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
  },
  modalText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Register;
