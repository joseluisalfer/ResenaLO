import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProfileImage from "../Componentes/Profile/ProfileImage/ProfileImage";
import EditUser from "../Componentes/Profile/EditUser/EditUser";

const EditProfile = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen de perfil */}
      <View style={styles.profileImageContainer}>
        <ProfileImage image={image} setImage={setImage} />
      </View>

      {/* Componente para editar los datos del usuario */}
      <EditUser />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});

export default EditProfile;
