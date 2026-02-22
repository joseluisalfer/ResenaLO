import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-paper";
import { getData } from "../../services/Services";
import Context from "../../Context/Context";

const PLACEHOLDER_IMG = "https://via.placeholder.com/600x400.png?text=No+image";

const Posts = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedFriend, setSearchUrl } = useContext(Context);

  const normalizeImageToUri = (imgRaw) => {
    const first = Array.isArray(imgRaw) ? imgRaw[0] : imgRaw;

    const value =
      typeof first === "string" ? first :
      first?.url ? first.url :
      null;

    if (!value || typeof value !== "string") return PLACEHOLDER_IMG;
    if (value.startsWith("http")) return value;
    if (value.startsWith("data:image")) return value;

    const cleanBase64 = value.replace(/[^A-Za-z0-9+/=]/g, "");
    return `data:image/jpeg;base64,${cleanBase64}`;
  };

  const changePageAndSendUri = (uri) => {
    setSearchUrl(uri);
    navigation.navigate("Place");
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const reviewUrls =
        selectedFriend?.reviews ??
        selectedFriend?.results?.reviews ??
        [];

      // ✅ Debug rápido
      console.log("selectedFriend:", selectedFriend);
      console.log("reviewUrls:", reviewUrls);

      if (!Array.isArray(reviewUrls) || reviewUrls.length === 0) {
        setPlaces([]);
        return;
      }

      const reviewDetails = await Promise.all(
        reviewUrls.map(async (url, index) => {
          try {
            const reviewData = await getData(url);

            return {
              id: reviewData?.id ?? `review_${index}_${url}`,
              name: reviewData?.title ?? reviewData?.type ?? "Sin título",
              image: { uri: normalizeImageToUri(reviewData?.images) },
              rating: reviewData?.valoration ?? 0,
              uri: url,
            };
          } catch (e) {
            console.log("Error cargando review:", url, e);
            return {
              id: `error_${index}_${url}`,
              name: "Error al cargar",
              image: { uri: PLACEHOLDER_IMG },
              rating: 0,
              uri: url,
            };
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
  }, [selectedFriend]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1748ce" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        key={selectedFriend?.id ?? selectedFriend?.results?.id ?? "no_friend"}
        data={places}
        extraData={places}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item, index }) => {
          const backgroundColor =
            index % 3 === 0 ? "#1748ce" : index % 3 === 1 ? "#DC3545" : "white";
          const textColor = backgroundColor === "white" ? "black" : "white";

          return (
            <Pressable
              style={styles.card}
              onPress={() => changePageAndSendUri(item.uri)}
            >
              <Card style={[styles.cardContainer, { backgroundColor }]}>
                <Card.Cover
                  source={item.image}
                  style={styles.image}
                  resizeMode="cover"
                  onError={(e) =>
                    console.log("❌ Error imagen:", item.image, e?.nativeEvent)
                  }
                />
                <Card.Content style={styles.cardContent}>
                  <Text
                    style={[styles.placeName, { color: textColor }]}
                    numberOfLines={2}
                  >
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
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No hay reseñas disponibles</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    width: "100%"
  },

  debugText: {
    paddingTop: 8,
    paddingHorizontal: 8,
    fontSize: 12,
    opacity: 0.7,
  },

  card: {
    flex: 1,
    margin: 8,
    justifyContent: "center",
  },
  cardContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    height: 200,
  },
  image: {
    height: 120,
    width: "100%",
  },
  cardContent: {
    padding: 8,
    justifyContent: "space-between",
  },
  placeName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 12,
    marginTop: 4,
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 14,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Posts;
