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
    if (!verificationTerms) {
      alert("Debes aceptar los términos de privacidad");
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
        <Text style={styles.buttonText}>Términos de privacidad</Text>
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
                POLÍTICA DE PRIVACIDAD

                Última actualización: 23 de febrero de 2026

                En cumplimiento de lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016 (Reglamento General de Protección de Datos – RGPD), así como en la normativa nacional aplicable en materia de protección de datos, se informa a los usuarios de la aplicación titularidad de Reseñalo SL sobre la política de protección de datos personales que será de aplicación en el uso de la misma.

                El responsable del tratamiento de los datos es Reseñalo SL, con domicilio en Florida Universitaria. Reseñalo SL es la entidad responsable de determinar los fines y medios del tratamiento de los datos que se puedan recoger a través de la aplicación.

                La aplicación podrá recopilar y tratar información necesaria para el correcto funcionamiento del servicio, incluyendo datos técnicos, datos de uso y cualquier otra información necesaria para prestar las funcionalidades ofrecidas. En ningún caso se solicitarán ni tratarán datos personales que no resulten adecuados, pertinentes y limitados a lo necesario en relación con los fines para los que sean tratados.

                Los datos recogidos serán utilizados con la finalidad de permitir el acceso y uso de la aplicación, gestionar la relación con los usuarios, mejorar la experiencia de uso, garantizar la seguridad del servicio, atender consultas o solicitudes y cumplir con las obligaciones legales que resulten de aplicación. Asimismo, podrán utilizarse con fines de mejora del servicio mediante el análisis del funcionamiento de la aplicación.

                La base jurídica que legitima el tratamiento será la ejecución del servicio solicitado por el usuario, el cumplimiento de obligaciones legales, así como el interés legítimo de Reseñalo SL en garantizar el correcto funcionamiento y seguridad de la aplicación.

                Los datos serán conservados únicamente durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados y para determinar posibles responsabilidades derivadas del servicio prestado, así como durante los plazos exigidos por la legislación vigente. Finalizado dicho periodo, los datos serán suprimidos o anonimizados.

                Reseñalo SL podrá contar con proveedores de servicios que actúen como encargados del tratamiento, tales como servicios de alojamiento, mantenimiento técnico o herramientas tecnológicas necesarias para el funcionamiento de la aplicación. En todo caso, dichos proveedores estarán obligados contractualmente a garantizar la confidencialidad y seguridad de la información tratada. Los datos no serán vendidos ni cedidos a terceros, salvo obligación legal.

                En caso de que para la prestación del servicio fuera necesaria la utilización de servicios ubicados fuera del Espacio Económico Europeo, se adoptarán las garantías adecuadas conforme a la normativa vigente en materia de protección de datos.

                Reseñalo SL adopta las medidas técnicas y organizativas necesarias para garantizar la seguridad, integridad y confidencialidad de los datos, evitando su alteración, pérdida, tratamiento o acceso no autorizado.

                La aplicación no está dirigida a menores de 14 años. Reseñalo SL no recoge deliberadamente información de menores sin el consentimiento correspondiente. En caso de tener conocimiento de que se han recopilado datos de un menor sin la debida autorización, se procederá a su eliminación.

                La presente Política de Privacidad podrá ser modificada para adaptarla a posibles cambios legislativos o mejoras en la aplicación. En caso de producirse modificaciones relevantes, se informará a los usuarios a través de los medios disponibles en la propia aplicación.

                El uso de la aplicación implica la aceptación de esta Política de Privacidad.
              </Text>
            </ScrollView>
            <View style={{ marginTop: 20 }}>
              <Button onPress={handleTermsConfirm} mode="contained" buttonColor="black">
                Aceptar Términos
              </Button>
              <Text onPress={() => setModalTermsVisible(false)} style={styles.cancelButton}>
                Cerrar
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
