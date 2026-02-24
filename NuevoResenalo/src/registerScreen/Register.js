import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData } from "../services/Services";
import Context from "../Context/Context";

/**
 * Register Component: Handles new user creation, email verification via token,
 * and legal terms acceptance.
 */
const Register = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme, isDark } = useContext(Context);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  // Verification & Legal State
  const [verificationCode, setVerificationCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationTerms, setVerificationTerms] = useState(false);
  const [modalTermsVisible, setModalTermsVisible] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !username || !name) {
      Alert.alert(t("alerts.error"), t("alerts.obligatory"));
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("alerts.error"), t("alerts.differentsPassword"));
      return false;
    }
    if (!validateEmail(email)) {
      Alert.alert(t("alerts.error"), t("alerts.isValidEmail"));
      return false;
    }
    if (!verificationTerms) {
      Alert.alert(t("alerts.error"), t("alerts.privacity"));
      return false;
    }
    return true;
  };

  /**
   * Initial registration: Sends data to backend to trigger verification email.
   */
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

      // Backend returns null on success for this specific API logic
      if (response === null) {
        setModalVisible(true);
      } else {
        Alert.alert(t("alerts.error"), t("alerts.registerProblem"));
      }
    } catch (error) {
      Alert.alert(t("alerts.error"), t("alerts.connection"));
    }
  };

  /**
   * Finalizes registration by verifying the token sent to the user's email.
   */
  const handleModalConfirm = async () => {
    if (!verificationCode.trim()) {
      Alert.alert(t("alerts.error"), t("alerts.code"));
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
        Alert.alert(t("alerts.error"), "Código de verificación incorrecto");
      }
    } catch (error) {
      Alert.alert(t("alerts.error"), t("alerts.connection"));
    }
  };

  const handleTermsConfirm = () => {
    setVerificationTerms(true);
    setModalTermsVisible(false);
  };

  // Helper for input styles based on theme
  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? "#1E1E1E" : "#fff",
      color: theme.text,
      borderColor: isDark ? "#444" : "#ccc",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {t("registerScreen.createAccount")}
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? "#AAA" : "#555" }]}>
        {t("registerScreen.footer")}
      </Text>

      {/* Verification Code Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? "#222" : "#fff" },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.text }]}>
              Introduce el código de verificación enviado a su correo
              electrónico
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="Código"
              placeholderTextColor={isDark ? "#666" : "#999"}
              value={verificationCode}
              onChangeText={setVerificationCode}
            />
            <Button
              onPress={handleModalConfirm}
              mode="contained"
              buttonColor={theme.primary || "black"}
            >
              Confirmar
            </Button>
            <Text
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancelar
            </Text>
          </View>
        </View>
      </Modal>

      {/* Form Fields */}
      <TextInput
        style={inputStyle}
        placeholder={t("registerScreen.email")}
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={inputStyle}
        placeholder={t("registerScreen.password")}
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={inputStyle}
        placeholder={t("registerScreen.confirm")}
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={inputStyle}
        placeholder={t("registerScreen.user")}
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={inputStyle}
        placeholder={t("registerScreen.name")}
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <Pressable
        style={[styles.button, { backgroundColor: theme.text }]}
        onPress={handleRegister}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          {t("registerScreen.register")}
        </Text>
      </Pressable>

      <Pressable
        style={styles.buttonTerms}
        onPress={() => setModalTermsVisible(true)}
      >
        <Text style={styles.buttonText}>
          {verificationTerms
            ? `✅ ${t("registerScreen.buttonPrivaticy")}`
            : t("registerScreen.buttonPrivaticy")}
        </Text>
      </Pressable>

      {/* Privacy Policy Modal */}
      <Modal
        visible={modalTermsVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalTermsContent,
              { backgroundColor: isDark ? "#1A1A1A" : "white" },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.legalText, { color: theme.text }]}>
                PRIVACY POLICY{"\n"}Last updated: February 23, 2026{"\n\n"}
                {/* Policy text clipped for brevity, keep your original text here */}
                In compliance with Regulation (EU) 2016/679...
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button
                onPress={handleTermsConfirm}
                mode="contained"
                buttonColor={isDark ? "#fff" : "#000"}
                textColor={isDark ? "#000" : "#fff"}
              >
                {t("registerScreen.buttonAccept")}
              </Button>
              <Text
                onPress={() => setModalTermsVisible(false)}
                style={styles.cancelButton}
              >
                {t("registerScreen.buttonClose")}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    height: 50,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
  },
  buttonTerms: {
    marginTop: 15,
    backgroundColor: "#2654d1",
    justifyContent: "center",
    height: 50,
    width: "100%",
    borderRadius: 12,
  },
  buttonText: { textAlign: "center", fontSize: 16, fontWeight: "600" },
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
    alignItems: "stretch",
  },
  modalText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 22,
  },
  cancelButton: {
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "600",
  },
  modalTermsContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    width: "100%",
    height: "80%",
    position: "absolute",
    bottom: 0,
  },
  legalText: { fontSize: 14, lineHeight: 22, textAlign: "justify" },
  modalFooter: { marginTop: 20, paddingBottom: 10 },
});

export default Register;
