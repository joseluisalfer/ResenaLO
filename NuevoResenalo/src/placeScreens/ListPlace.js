import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { getData } from "../services/services";
import Context from "../Context/Context";

const ListPlace = ({ navigation }) => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSearchUrl } = useContext(Context);

  const changePageAndSendUri = (uri) => {
    setSearchUrl(uri);
    navigation.navigate("Place");
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const data = await getData("http://44.213.235.160:8080/resenalo/reviews");
      const reviewUrls = data?.reviews ?? [];

      if (!Array.isArray(reviewUrls) || reviewUrls.length === 0) {
        setPlaces([]);
        return;
      }

      const reviewDetails = await Promise.all(
        reviewUrls.map(async (url) => {
          try {
            const reviewData = await getData(url);

            const imgRaw = reviewData?.images;
            const currentImage = Array.isArray(imgRaw) ? imgRaw[0] : imgRaw;

            if (!currentImage) return null;

            const imageUri =
              typeof currentImage === "string" &&
              currentImage.startsWith("data:image")
                ? currentImage
                : `data:image/jpeg;base64,${currentImage}`;

            return {
              id: reviewData?.id ?? url,
              name: reviewData?.title ?? "Sin título",
              image: { uri: imageUri },
              rating: reviewData?.valoration ?? 0,
              ruta: url,
            };
          } catch {
            return null;
          }
        })
      );

      setPlaces(reviewDetails.filter(Boolean));
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1748ce" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.title}>{t("buttonExplorer.list")}</Text>

        {/* Spacer para centrar el título (equilibra el icono de la izquierda) */}
        <View style={styles.rightSpacer} />
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => changePageAndSendUri(item.ruta)}>
              <View style={styles.item}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.placeName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="image-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No hay reseñas para mostrar</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    paddingTop: 10, // en vez de marginTop: "30%"
  },
  backButton: { width: 30 },

  // centrado real del título
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },

  // mismo ancho que el icono para centrar el título
  rightSpacer: { width: 30 },

  listWrapper: { width: "100%", marginBottom: "10%" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: { width: "50%", height: 100, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1 },
  placeName: { fontSize: 18, fontWeight: "bold", color: "#000" },
  rating: { fontWeight: 'bold', fontSize: 20, color: "#777" },
  emptyBox: { alignItems: "center", padding: 30 },
  emptyText: { marginTop: 10, color: "#666" },
});
//oscarmartorellg@gmail.com
export default ListPlace;