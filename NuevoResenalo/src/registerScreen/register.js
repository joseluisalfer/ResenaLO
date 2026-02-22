import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData, getData } from "../services/Services";
import Context from "../Context/Context";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();
  const { setIsLoged, setEmailLogged } = useContext(Context);

  // Verificación del código
  const [verificationCode, setVerificationCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Validación de campos vacíos
  const validateForm = () => {
    if (!email || !password || !confirmPassword || !username || !name) {
      alert("Todos los campos son obligatorios");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return false;
    }
    if (!validateEmail(email)) {
      alert("Por favor, ingresa un correo electrónico válido");
      return false;
    }
    return true;
  };

  //serranotarazonadavid@gmail.com
  // Validación del correo electrónico con expresión regular
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const registrationData = {
      email: email,
      password: password,
      user: username,
      name: name,
    };

    try {
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/register",
        registrationData,
      );

      // Verifica si la respuesta es válida y tiene un estado adecuado

      if (response === null) {
        setModalVisible(true); // Muestra el modal de verificación después de registrar
      } else {
        console.error("Respuesta no exitosa:", response);
        alert("Hubo un problema con el registro");
      }
    } catch (error) {
      console.error("Error en la conexión", error);
      alert("Hubo un problema con la conexión");
    }
  };

  const handleModalConfirm = async () => {
    if (!verificationCode.trim()) {
      alert("Por favor, ingresa el código de verificación.");
      return;
    }

    try {
      const data = {
        token: verificationCode,
        email: email,
      };
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/verifyEmail",
        data,
      );

      if (response === null) {
        setModalVisible(false);
        navigation.goBack();
      } else {
        setModalVisible(false);
        alert("Código de verificación incorrecto");
      }
    } catch (error) {
      console.error("Error en la conexión", error);
      alert("Hubo un problema con la conexión");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("registerScreen.createAccount")}</Text>
      <Text style={styles.subtitle}>{t("registerScreen.footer")}</Text>

      {/* Modal de verificación */}
      <Modal
        visible={modalVisible} // Controla si el modal es visible o no
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Cerrar modal cuando presionan fuera del modal
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Introduce el código de verificación enviado a su correo
              electrónico
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Código de verificacion"
              autoCapitalize="none"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            {verificationCode.trim().length > 0 && (
              <Button onPress={handleModalConfirm} mode="contained">
                Confirmar
              </Button>
            )}
            <Text
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancelar
            </Text>
          </View>
        </View>
      </Modal>

      {/* Formulario de registro */}
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
        placeholder={t("registerScreen.name")}
        value={name}
        onChangeText={setName}
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
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: "#f7f7f7",
    marginTop: 20,
  },
  banner: {
    marginBottom: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "black",
    justifyContent: "center",
    padding: 12,
    height: 50,
    width: 300,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  cancelButton: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
  },
  modalText: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Register;
