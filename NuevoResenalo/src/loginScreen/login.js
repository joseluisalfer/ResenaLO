import { StyleSheet, View, Text } from "react-native";
import Banner from "../Componentes/Banner/Banner";
import SetData from "../Componentes/Buttons/SetData/setData";
import Registrarse from "../Componentes/Buttons/RegisterButton/registerButton";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";

/**
 * Login Screen: The entry point for the application.
 * Provides inputs for existing users to sign in and a path
 * for new users to create an account.
 */
const Login = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Visual branding header */}
      <Banner />

      {/* Login Section */}
      <Text style={styles.titulo}>{t("loginScreen.login")}</Text>
      <Text style={styles.descripcion}>{t("loginScreen.footer")}</Text>
      <SetData navigation={navigation} />

      {/* Registration Section */}
      <Text style={styles.titulo}>{t("loginScreen.createAccount")}</Text>
      <Text style={styles.descripcion}>{t("loginScreen.textAccount")}</Text>
      <Registrarse navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
    // Align content towards the top to accommodate the keyboard later
    justifyContent: "flex-start",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  descripcion: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
    // Note: Ensure Verdana is linked in your project assets
    // or fallback to a system font if needed.
    fontFamily: "verdana",
  },
});

export default Login;
