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
import { useTranslation } from 'react-i18next'
import '../../assets/i18n/index';
const ListPlace = ({ navigation }) => {
  const { t } = useTranslation();

  const [places, setPlaces] = useState([
    {
      id: "1",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      rating: 4.5,
    },
    {
      id: "2",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      rating: 4.0,
    },
    {
      id: "3",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      rating: 3.8,
    },
    {
      id: "4",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      rating: 4.5,
    },
    {
      id: "5",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      rating: 4.0,
    },
    {
      id: "6",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      rating: 3.8,
    },
    {
      id: "7",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      rating: 4.5,
    },
    {
      id: "8",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      rating: 4.0,
    },
    {
      id: "9",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      rating: 3.8,
    },
  ]);

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
        <Text style={styles.title}>{t("buttonExplorer.list")}</Text>
      </View>
      <View style={{ width: "100%" }}>
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate("Place")}>
              <View style={styles.item}>
                {/* Imagen rectangular con borde redondeado */}
                <Image source={item.image} style={styles.image} />

                <View style={styles.textContainer}>
                  {/* Título de la ubicación */}
                  <Text style={styles.placeName}>{item.name}</Text>
                  {/* Estrellas debajo del título */}
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
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
  },
  image: {
    width: "50%",
    height: 100,
    borderRadius: 10, // Borde redondeado de la imagen
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
  rating: {
    fontSize: 16,
    color: "#777",
  },
});

export default ListPlace;
