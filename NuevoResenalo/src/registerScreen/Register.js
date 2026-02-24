import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Modal,
  ScrollView
} from "react-native";
import { Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData, getData } from "../services/Services";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const { t } = useTranslation();

  // Verificación del código
  const [verificationCode, setVerificationCode] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Verificacion terminos condiciones
  const [verificationTerms, setVerificationTerms] = useState(false);
  const [modalTermsVisible, setModalTermsVisible] = useState(false);

  // Validación de campos vacíos
  const validateForm = () => {
    if (!email || !password || !confirmPassword || !username || !name) {
      alert(t("alerts.obligatory"));
      return false;
    }
    if (password !== confirmPassword) {
      alert(t("alerts.differentsPassword"));
      return false;
    }
    if (!validateEmail(email)) {
      alert(t("alerts.isValidEmail"));
      return false;
    }
    if (!verificationTerms) {
      alert(t("alerts.privacity"));
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
        alert(t("alerts.registerProblem"));
      }
    } catch (error) {
      console.error("Error en la conexión", error);
      alert(t("alerts.connection"));
    }
  };

  const handleModalConfirm = async () => {
    if (!verificationCode.trim()) {
      alert(t("alerts.code"));
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

  const handleTermsVisible = () => {
    setModalTermsVisible(true);
  }

  const handleTermsConfirm = () => {
    setVerificationTerms(true);
    setModalTermsVisible(false);
  }

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

      <Pressable style={styles.buttonTerms} onPress={handleTermsVisible}>
        <Text style={styles.buttonText}>{t("registerScreen.buttonPrivaticy")}</Text>
      </Pressable>

      {/* Modal Para aceptar terminos de privacidad*/}
      <Modal
        visible={modalTermsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalTermsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalTermsContent}>
            <ScrollView tyle={styles.scrollContainer}>
              <Text style={styles.legalText}>
                PRIVACY POLICY
                Last updated: February 23, 2026

                In compliance with the provisions of Regulation (EU) 2016/679 of the European Parliament and of the Council of April 27, 2016 (General Data Protection Regulation – GDPR), as well as applicable national data protection regulations, users of the application owned by Reseñalo SL are hereby informed of the personal data protection policy that will apply to its use.

                The Data Controller is Reseñalo SL, located at Florida Universitaria. Reseñalo SL is the entity responsible for determining the purposes and means of processing the data that may be collected through the application.

                The application may collect and process information necessary for the correct operation of the service, including technical data, usage data, and any other information required to provide the offered functionalities. Under no circumstances will personal data be requested or processed that is not adequate, relevant, and limited to what is necessary in relation to the purposes for which it is processed.

                The data collected will be used for the purpose of allowing access to and use of the application, managing the relationship with users, improving the user experience, ensuring the security of the service, addressing inquiries or requests, and complying with applicable legal obligations. Likewise, it may be used to improve the service by analyzing the performance of the application.

                The legal basis for processing is the performance of the service requested by the user, compliance with legal obligations, and the legitimate interest of Reseñalo SL in ensuring the correct operation and security of the application.

                Data will be retained only for the time necessary to fulfill the purpose for which it was collected and to determine possible liabilities arising from the service provided, as well as during the periods required by current legislation. Once this period has ended, the data will be deleted or anonymized.

                Reseñalo SL may use service providers acting as data processors, such as hosting services, technical maintenance, or technological tools necessary for the application's operation. In all cases, these providers will be contractually obligated to guarantee the confidentiality and security of the processed information. Data will not be sold or transferred to third parties, except under legal obligation.

                Should the provision of the service require the use of services located outside the European Economic Area, appropriate safeguards will be adopted in accordance with current data protection regulations.

                Reseñalo SL adopts the technical and organizational measures necessary to guarantee the security, integrity, and confidentiality of the data, preventing its alteration, loss, unauthorized processing, or access.

                The application is not directed at children under 14 years of age. Reseñalo SL does not deliberately collect information from minors without the corresponding consent. If it becomes known that data from a minor has been collected without proper authorization, it will be deleted.

                This Privacy Policy may be modified to adapt to possible legislative changes or improvements to the application. In the event of significant changes, users will be informed through the means available within the application itself.

                The use of the application implies the acceptance of this Privacy Policy.
              </Text>
            </ScrollView>
            <View style={{ marginTop: 20 }}>
              <Button onPress={handleTermsConfirm} mode="contained" buttonColor="black">
                {t("registerScreen.buttonAccept")}
              </Button>
              <Text onPress={() => setModalTermsVisible(false)} style={styles.cancelButton}>
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
    color: "#000",
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
    backgroundColor: "#fff",
    color: "#000",
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
  buttonTerms: {
    marginTop: 10,
    backgroundColor: "#2654d1",
    justifyContent: "center",
    padding: 12,
    height: 50,
    width: 300,
    borderRadius: 10,
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
  // Estilo para el contenedor blanco del modal
  modalTermsContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30, // Más elegante si solo redondeamos arriba
    borderTopRightRadius: 30,
    paddingHorizontal: 20,   // Espacio a los lados para que el texto no pegue al borde
    paddingTop: 30,
    paddingBottom: 20,
    width: "100%",           // Ocupa todo el ancho
    height: "60%",           // Casi toda la pantalla de alto
    position: "absolute",
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  legalText: {
    fontSize: 16,            // Un poco más grande para facilitar lectura
    lineHeight: 24,          // Espaciado generoso
    color: "#222",
    textAlign: "left",       // Alineación natural a la izquierda
    paddingBottom: 20,
  },
  // Contenedor del Scroll para dar un margen interno
  scrollContainer: {
    flex: 1,
    paddingRight: 5, // Espacio para la barra de scroll
  },
  // Estilo del texto legal (Legible)
  legalText: {
    fontSize: 14,
    lineHeight: 22, // Espaciado entre líneas clave
    color: "#444",
    textAlign: "justify",
  },
  // Botón de aceptar dentro del modal
  acceptButton: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 5,
    backgroundColor: "black",
  },
});

export default Register;
