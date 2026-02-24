import React, { useState, useContext } from "react"; 
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ProfileImage from "../Componentes/Profile/ProfileImage/ProfileImage";
import EditUser from "../Componentes/Profile/EditUser/EditUser";
import Context from "../Context/Context"; 

const EditProfile = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  // Extraemos el tema del contexto
  const { theme } = useContext(Context);

  return (
    /* Envolvemos en una View con el fondo del tema para que, 
       si el ScrollView rebota, no se vea nada blanco detrás.
    */
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        // flexGrow asegura que el fondo cubra TODA la pantalla aunque el contenido sea poco
        contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.background }}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen de perfil se queda aquí */}
        <View style={styles.profileImageContainer}>
          <ProfileImage image={image} setImage={setImage} />
        </View>

        {/* Componente de edición (Asegúrate de quitar la foto de dentro de EditUser) */}
        <EditUser />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 10, // Ajustado para que pegue mejor con el formulario
    marginTop: 20,
  },
});

export default EditProfile;