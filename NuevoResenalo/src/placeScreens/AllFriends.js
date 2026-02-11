import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importando Ionicons

const AllFriends = ({ navigation }) => {
  const [friends, setFriends] = useState([
    {
      id: "1",
      name: "David Serrano",
      image: require("../../assets/images/DavidCaganer.jpeg"),
      friendsCount: 150,
    },
    {
      id: "2",
      name: "Samuel Rodriguez",
      image: require("../../assets/images/SamuDown.jpeg"),
      friendsCount: 120,
    },
    {
      id: "3",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      friendsCount: 75,
    },
    {
      id: "4",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      friendsCount: 200,
    },
    {
      id: "5",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      friendsCount: 180,
    },
    {
      id: "6",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      friendsCount: 100,
    },
    {
      id: "7",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      friendsCount: 190,
    },
    {
      id: "8",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      friendsCount: 150,
    },
    {
      id: "9",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      friendsCount: 110,
    },
  ]);

  // Function to alternate the first two profile images
  const alternateProfiles = (friendsArray) => {
    const firstTwo = friendsArray.slice(0, 2);
    const rest = friendsArray.slice(2);
    return [...firstTwo.reverse(), ...rest];
  };

  const alternatingFriends = alternateProfiles(friends);

  return (
    <View style={styles.container}>
      {/* Contenedor para la flecha y el título */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Lista de Amigos</Text>
      </View>
      <View style={{ width: "100%" }}>
        <FlatList
          data={alternatingFriends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate("Friend", { friendId: item.id })}>
              <View style={styles.item}>
                {/* Imagen circular con borde redondeado */}
                <Image source={item.image} style={styles.image} />

                <View style={styles.textContainer}>
                  {/* Título de la ubicación */}
                  <Text style={styles.placeName}>{item.name}</Text>
                  {/* Amigos y número */}
                  <View style={styles.friendsContainer}>
                    <Ionicons name="people" size={16} color="black" />
                    <Text style={styles.friendsText}> Amigos: {item.friendsCount}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row", // Alinea la flecha y el título en una fila
    alignItems: "center",
    marginBottom: 20,
    marginTop: "30%",
    width: "100%",
  },
  backButton: {
    marginRight: 10, // Espacio entre la flecha y el título
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginLeft: "18%",
  },
  item: {
    flexDirection: "row", // Coloca imagen y texto en fila
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%", // Asegura que ocupe todo el ancho
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5, // Sombra para el estilo de la card
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30, // Imagen circular
    marginRight: 15,
  },
  textContainer: {
    flex: 1, // Asegura que el texto ocupe el espacio restante
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  friendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  friendsText: {
    fontSize: 16,
    color: "#777",
    marginLeft: 5,
  },
});

export default AllFriends;
