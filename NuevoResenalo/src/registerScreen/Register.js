import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData } from "../services/Services";
import Context from "../Context/Context";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();
  
  // Extraemos theme e isDark del contexto
  const { theme, isDark } = useContext(Context);

  const [verificationCode, setVerificationCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !username || !name) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido");
      return false;
    }
    return true;
  };

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

      if (response === null) {
        setModalVisible(true);
      } else {
        Alert.alert("Error", "Hubo un problema con el registro");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema con la conexión");
    }
  };

  const handleModalConfirm = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("Error", "Por favor, ingresa el código.");
      return;
    }

    try {
      const data = { token: verificationCode, email: email };
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/verifyEmail",
        data,
      );

      if (response === null) {
        setModalVisible(false);
        navigation.goBack();
      } else {
        Alert.alert("Error", "Código de verificación incorrecto");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema con la conexión");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t("registerScreen.createAccount")}</Text>
      <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#555" }]}>{t("registerScreen.footer")}</Text>

      {/* Modal de verificación adaptado */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? "#1e1e1e" : "white" }]}>
            <Text style={[styles.modalText, { color: theme.text }]}>
              Introduce el código de verificación enviado a su correo electrónico
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDark ? "#121212" : "#fff", 
                color: theme.text,
                borderColor: isDark ? "#444" : "#ccc"
              }]}
              placeholder="Código de verificacion"
              placeholderTextColor={isDark ? "#666" : "#999"}
              autoCapitalize="none"
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            {verificationCode.trim().length > 0 && (
              <Button onPress={handleModalConfirm} mode="contained" buttonColor="#2654d1">
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
        style={[styles.input, { 
            backgroundColor: isDark ? "#121212" : "#fff", 
            color: theme.text,
            borderColor: isDark ? "#333" : "#ccc"
        }]}
        placeholder={t("registerScreen.email")}
        placeholderTextColor={isDark ? "#666" : "#999"}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { 
            backgroundColor: isDark ? "#121212" : "#fff", 
            color: theme.text,
            borderColor: isDark ? "#333" : "#ccc"
        }]}
        placeholder={t("registerScreen.password")}
        placeholderTextColor={isDark ? "#666" : "#999"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { 
            backgroundColor: isDark ? "#121212" : "#fff", 
            color: theme.text,
            borderColor: isDark ? "#333" : "#ccc"
        }]}
        placeholder={t("registerScreen.confirm")}
        placeholderTextColor={isDark ? "#666" : "#999"}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={[styles.input, { 
            backgroundColor: isDark ? "#121212" : "#fff", 
            color: theme.text,
            borderColor: isDark ? "#333" : "#ccc"
        }]}
        placeholder={t("registerScreen.user")}
        placeholderTextColor={isDark ? "#666" : "#999"}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { 
            backgroundColor: isDark ? "#121212" : "#fff", 
            color: theme.text,
            borderColor: isDark ? "#333" : "#ccc"
        }]}
        placeholder={t("registerScreen.name")}
        placeholderTextColor={isDark ? "#666" : "#999"}
        value={name}
        onChangeText={setName}
      />

      <Pressable 
        style={[styles.button, { backgroundColor: isDark ? "#2654d1" : "black" }]} 
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>{t("registerScreen.register")}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // Ajustado para centrar mejor el form
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    padding: 12,
    height: 50,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    borderRadius: 20,
    padding: 25,
    width: "85%",
    elevation: 10,
  },
  cancelButton: {
    color: "#DC3545",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  modalText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 22,
  },
});

export default Register;