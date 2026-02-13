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
    <ScrollView style={styles.container}>
      {/* ModalProfile que maneja el modal y las opciones */}
      <View style={{ flex: 2 }}>
        <ModalProfile
          handleLogOut={handleLogOut}
          handleChangeLanguage={handleChangeLanguage}
        />
      </View>

      {/* Información personal */}
      <View style={{ flex: 3 }}>
        <OwnInfo />
      </View>

      {/* Estadísticas o información adicional */}
      <View style={{ flex: 4 }}>
        <CardInfo />
      </View>

      {/* Divisor entre la información del perfil y las publicaciones */}
      <View style={{ alignItems: "center" }}>
        <Divider style={{ marginVertical: 16, width: "80%" }} />
      </View>

      {/* Publicaciones */}
      <View style={{ flex: 5 }}>
        <Posts navigation={navigation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 40,
    backgroundColor: "white",
  },
});

export default Profile;
