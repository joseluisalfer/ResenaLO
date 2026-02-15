import React from "react";
import { View, FlatList, StyleSheet, Text, Pressable, Image } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next'
import '../../../../assets/i18n/index';
import { useState } from "react";
{/*const mockPosts = [
  {
    id: "1",
    title: "En Catarroja hay moros",
    content: "No lo digo yo, lo dice la gente, ¡vaya locura! 😂",
  },
  {
    id: "2",
    title: "Que no lo vea mi madre!",
    content: "Que no vea mi madre ese mueble de la basura que se lo lleva para casa!!! 😲"
  },
  {
    id: "3",
    title: "Un secretillo",
    content: "Y un secretillo... he comido jamón. 🤫"
  },
  {
    id: "4",
    title: "Sabeis que??",
    content: "He robado en el dia"
  }
];*/}

const PostList = () => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([
    {
      id: "1",
      name: "Catarroja Plaza",
      image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
      rating: 4.5,
    },
    {
      id: "2",
      name: "Catarroja Parque",
      image: require("../../../../assets/images/CatarrojaParque.jpg"),
      rating: 4.0,
    },
    {
      id: "3",
      name: "Catarroja Fuente",
      image: require("../../../../assets/images/CatarrojaFuente.jpg"),
      rating: 3.8,
    },
    {
      id: "4",
      name: "Catarroja Plaza",
      image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
      rating: 4.5,
    },
    {
      id: "5",
      name: "Catarroja Parque",
      image: require("../../../../assets/images/CatarrojaParque.jpg"),
      rating: 4.0,
    },
    {
      id: "6",
      name: "Catarroja Fuente",
      image: require("../../../../assets/images/CatarrojaFuente.jpg"),
      rating: 3.8,
    },
    {
      id: "7",
      name: "Catarroja Plaza",
      image: require("../../../../assets/images/CatarrojaPlaza.jpg"),
      rating: 4.5,
    },
    {
      id: "8",
      name: "Catarroja Parque",
      image: require("../../../../assets/images/CatarrojaParque.jpg"),
      rating: 4.0,
    },
    {
      id: "9",
      name: "Catarroja Fuente",
      image: require("../../../../assets/images/CatarrojaFuente.jpg"),
      rating: 3.8,
    },
  ]);

  return (
    <View style={styles.containerText}>
      <Text style={styles.postText} >Publicaciones</Text>
      {/* Contenedor para la flecha y el título */}
      <View style={styles.container}>
        <FlatList
          data={places}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable >{/*onPress={() => navigation.navigate("Place")}*/}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DC3545",
    padding: 20,
    width: "100%"
  },

  containerText: {
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 15
  },

  postText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold"
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

export default PostList;
