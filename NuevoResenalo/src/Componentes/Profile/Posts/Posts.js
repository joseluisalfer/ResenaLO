import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { getData } from "../../../services/services"; // Asegúrate de tener esta función configurada para obtener los datos
import Context from "../../../Context/Context"; // El contexto que contiene el emailLogged

const Posts = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { emailLogged } = useContext(Context); // Obtener el emailLogged desde el contexto
  const { setSearchUrl} = useContext(Context);

  const changePageAndSendUriProfile = (uri) => {
    navigation.navigate("Place");
    setSearchUrl(uri)
  };
  // Función para obtener las reseñas de las URLs
  const fetchReviews = async () => {
    try {
      setLoading(true);

      const reviewUrls = emailLogged?.results?.reviews ?? [];
      if (!Array.isArray(reviewUrls) || reviewUrls.length === 0) {
        setPlaces([]);
        return;
      }

      const reviewDetails = await Promise.all(
        reviewUrls.map(async (url) => {
          try {
            const reviewData = await getData(url); // Obtener los datos de cada reseña desde su enlace

            const imgRaw = reviewData?.images;
            const currentImage = Array.isArray(imgRaw) ? imgRaw[0] : imgRaw;

            if (!currentImage) return null;

            const imageUri =
              typeof currentImage === "string" &&
              currentImage.startsWith("data:image")
                ? currentImage
                : `data:image/jpeg;base64,${currentImage}`;
            console.log(reviewData);
            return {
              id: reviewData?.id ?? url,
              name: reviewData?.title ?? "Sin título",
              image: { uri: imageUri },
              rating: reviewData?.valoration ?? 0,
              uri: url,
            };
          } catch {
            return null;
          }
        }),
      );

      setPlaces(reviewDetails.filter(Boolean)); // Filtrar las reseñas válidas
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(); // Llamar a la función para obtener las reseñas
  }, [emailLogged]); // Se vuelve a ejecutar cuando cambia el `emailLogged`

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1748ce" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Grid de publicaciones con 2 columnas */}
      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Mostrar en 2 columnas
        renderItem={({ item, index }) => {
          const backgroundColor =
            index % 3 === 0 ? "#1748ce" : index % 3 === 1 ? "#DC3545" : "white";
          const textColor = backgroundColor === "white" ? "black" : "white";

          return (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => changePageAndSendUriProfile(item.uri)}
            >
              <Card style={[styles.cardContainer, { backgroundColor }]}>
                {/* Imagen dentro del Card */}
                <Card.Cover
                  source={item.image}
                  style={styles.image}
                  resizeMode="cover"
                />

                {/* Contenido del Card */}
                <Card.Content style={styles.cardContent}>
                  <Text style={[styles.placeName, { color: textColor }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.rating, { color: textColor }]}>
                    ⭐ {item.rating}
                  </Text>
                </Card.Content>
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    justifyContent: "center", // Asegura que el contenido esté centrado en la tarjeta
  },
  cardContainer: {
    flex: 1, // Hace que cada tarjeta ocupe el mismo espacio
    borderRadius: 12,
    overflow: "hidden",
    height: 200, // Definir una altura para mantener consistencia
  },
  image: {
    height: 120, // Imagen con una altura consistente
    width: "100%",
    borderRadius: 10,
    aspectRatio: 1.5,
  },
  cardContent: {
    padding: 8,
    justifyContent: "space-between",
  },
  placeName: {
    fontSize: 14, // Tamaño de fuente más pequeño
    fontWeight: "bold",
    color: "#fff", // Texto blanco para mayor contraste
  },
  rating: {
    fontSize: 12, // Tamaño de fuente más pequeño
    color: "#fff", // Texto blanco para mayor contraste
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Posts;
