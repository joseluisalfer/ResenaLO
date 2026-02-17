import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import WeekPlace from "../../src/Componentes/Home/WeeksPlaces/weekPlaces";
import Friends from "../../src/Componentes/Home/Friends/friends";
import Explore from "../../src/Componentes/Home/Explore/Explore";
import { getData } from "../services/services"; // Asegúrate de que la función getData esté importada correctamente
import Context from "../Context/Context"; // Importamos el contexto
import { useNavigation } from "@react-navigation/native";
const HomeScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const { setSelectedFriend } = useContext(Context); // Usamos el contexto para acceder a la función para seleccionar un amigo
  
  useEffect(() => {
    obtainUsers();
  }, []);

  const obtainUsers = async () => {
    // Primer solicitud para obtener las URLs de los usuarios
    const data = await getData("http://44.213.235.160:8080/resenalo/users");
    const userUrls = data.users;

    // Realizamos las solicitudes a cada URL de usuario para obtener sus nombres y fotos
    const userDetails = await Promise.all(
      userUrls.map(async (url) => {
        const userData = await getData(url);
        const { user, photo } = userData.results; // Obtener nombre y foto del usuario

        // Si la foto es base64, formatearla correctamente
        const imageUri = photo && photo.startsWith("data:image") ? photo : `data:image/jpeg;base64,${photo}`;

        return { user, photo: imageUri }; // Devolvemos un objeto con nombre y foto
      })
    );

    // Actualizar el estado con la lista de amigos que incluye nombre y foto
    const friendsList = userDetails.map((user, index) => ({
      id: (index + 1).toString(),
      name: user.user,
      photo: user.photo, // Agregamos la foto del usuario
    }));

    setFriends(friendsList); // Actualizamos el estado con la lista de amigos
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <WeekPlace navigation={navigation} />
      </View>

      <View style={styles.mid}>
        <Friends
          navigation={navigation}
          friends={friends}
          setSelectedFriend={setSelectedFriend} // Pasamos la función del contexto para seleccionar un amigo
        />
      </View>

      <View style={styles.bottom}>
        <Explore navigation={navigation} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
  },
  top: {
    flex: 2,
    marginBottom: 10,
  },
  mid: {
    flex: 1.2,
    marginBottom: 5,
  },
  bottom: {
    flex: 3,
  },
});
