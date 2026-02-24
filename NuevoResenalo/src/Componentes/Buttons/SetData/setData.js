import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { getData, postData } from "../../../services/Services";
import Context from "../../../Context/Context";

/**
 * PedirDatos Component: Handles user input and login logic
 */
const SetData = ({ navigation }) => {
  const { setIsLoged, setEmailLogged } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();

  // Basic email format validation
  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  /**
   * Processes the authentication and fetches user data
   */
  const handleOnPress = async () => {
    // Validation for empty fields and email format
    if (email === "" || password === "") {
      alert(t("alerts.empptyData"));
      return;
    }

    if (!validateEmail(email)) {
      alert(t("alerts.invalidEmail"));
      return;
    }

    const data = { email, password };

    try {
      // POST request to perform login
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/login",
        data,
      );

      // Fetch user profile data based on login email
      const dataEmail = await getData(
        `http://44.213.235.160:8080/resenalo/userEmail?email=${email}`,
      );
      setEmailLogged(dataEmail);

      // Successfully logged in if the response is null
      if (response === null) {
        setIsLoged(true);
      } else {
        const errorMessage =
          response && response.error ? response.error : t("Error");
        alert(errorMessage);
      }
    } catch (error) {
      alert(t("alerts.loginError"));
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
          placeholder={t("loginScreen.passwordPlaceHolder")}
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

      {/* Visual separator */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.line} />
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  dividerText: {
    marginHorizontal: 8,
  },
});

export default SetData;
