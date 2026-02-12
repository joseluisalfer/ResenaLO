import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import "../../../../assets/i18n/index"; // Asegúrate de que esto está en el directorio adecuado
import { postData } from "../../../services/services"; // Asegúrate de que esta ruta sea correcta
import Context from "../../../Context/Context"; 

const PedirDatos = ({ navigation }) => {
  const { setIsLoged } = useContext(Context); // Usamos el contexto para manejar el estado global
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  // Función para validar si el email tiene un formato correcto
  const validateEmail = (email) => {
    // Expresión regular básica para email
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  const handleOnPress = async () => {
    // Validar que los campos no estén vacíos
    if (email === "" || password === "") {
      alert(t("loginScreen.emptyFields"));
      return;
    }

    // Validar que el correo electrónico sea correcto
    if (!validateEmail(email)) {
      alert(t("loginScreen.invalidEmail"));
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    try {
      // Enviar datos al servidor con POST
      const response = await postData(
        "http://44.213.235.160:8080/first/login",
        data,
      );
      console.log("Respuesta del servidor:", response);

      // Si la respuesta es exitosa (código 200 OK), redirigir a la pantalla principal
      if (response.ok) {
        // Actualiza el estado isLoged a true
        setIsLoged(true);

        // Navegar a la pantalla principal
        navigation.navigate("Main"); // Cambiar de pantalla
      } else {
        alert(t("Error"));
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert(t("loginScreen.loginError"));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.space}>
        <TextInput
          style={styles.inputs}
          placeholder={t("email@gmail.com")}
          onChangeText={(newText) => setEmail(newText)}
          value={email}
        />
      </View>
      <View style={styles.space}>
        <TextInput
          style={styles.inputs}
          placeholder={t("loginScreen.passwordPlaceholder")}
          onChangeText={(newText) => setPassword(newText)}
          secureTextEntry={true}
          value={password}
        />
      </View>
      <View style={styles.space}>
        <Pressable style={styles.buttom} onPress={handleOnPress}>
          <Text style={styles.text_buttom}>{t("loginScreen.login")}</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "80%",
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        <Text style={{ marginHorizontal: 8 }}>o</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  inputs: {
    borderRadius: 10,
    borderWidth: 2,
    height: 50,
    width: 300,
    padding: 15,
    borderColor: "#D1D1D1",
    fontSize: 15,
  },
  space: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttom: {
    backgroundColor: "black",
    justifyContent: "center",
    padding: 15,
    height: 50,
    width: 300,
    borderRadius: 10,
  },
  text_buttom: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
});

export default PedirDatos;
