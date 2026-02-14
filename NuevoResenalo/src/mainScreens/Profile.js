import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Divider } from "react-native-paper";
import Posts from "../Componentes/Profile/Posts/Posts";
import OwnInfo from "../Componentes/Profile/OwnInfo/OwnInfo";
import CardInfo from "../Componentes/Profile/CardInfo/CardInfo";
import ModalProfile from "../Componentes/Profile/ModalProfile/ModalProfile";

const Profile = ({ navigation }) => {
  const handleLogOut = () => {
    console.log("Log Out clicked");
  };

  const handleChangeLanguage = (language) => {
    console.log("Idioma cambiado a: ", language);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ModalProfile que maneja el modal y las opciones */}
      <View style={styles.section}>
        <ModalProfile
          handleLogOut={handleLogOut}
          handleChangeLanguage={handleChangeLanguage}
        />
      </View>

      {/* Información personal */}
      <View style={styles.section}>
        <OwnInfo />
      </View>

      {/* Estadísticas o información adicional */}
      <View style={styles.section}>
        <CardInfo />
      </View>

      {/* Divisor entre la información del perfil y las publicaciones */}
      <View style={styles.divider}>
        <Divider style={styles.dividerLine} />
      </View>

      {/* Publicaciones */}
      <View style={styles.postsSection}>
        <Posts navigation={navigation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 16,
    paddingTop: 20
  },
  section: {
    marginBottom: 16,
  },
  postsSection: {
    paddingHorizontal: 16,
  },
  divider: {
    alignItems: "center",
  },
  dividerLine: {
    marginVertical: 16,
    width: "80%",
  },
});

export default Profile;
