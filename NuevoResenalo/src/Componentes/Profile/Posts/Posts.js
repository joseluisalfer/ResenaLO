import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Card } from "react-native-paper";
import { getData } from "../../../services/Services";
import Context from "../../../Context/Context";
import { useFocusEffect } from '@react-navigation/native';

const Posts = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { emailLogged, setSearchUrl } = useContext(Context);

  const changePageAndSendUriProfile = (uri) => {
    setSearchUrl(uri);
    navigation.navigate("Place");
  };

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
            const reviewData = await getData(url);

            // Intentamos sacar la URL de 'image' o de la primera posición de 'images'
            const finalImageUrl = reviewData?.image || (Array.isArray(reviewData?.images) ? reviewData.images[0] : null);

            return {
              id: reviewData?.id ?? url,
              name: reviewData?.title ?? "Sin título",
              image: finalImageUrl ? { uri: finalImageUrl } : null,
              rating: reviewData?.valoration ?? 0,
              uri: url,
            };
          } catch {
            return null;
          }
        }),
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
  }, [emailLogged]);

    useFocusEffect(
      useCallback(() => {
        fetchReviews();
      }, [])
    )

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
        data={places}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item, index }) => {
          const backgroundColor =
            index % 3 === 0 ? "#1748ce" : index % 3 === 1 ? "#DC3545" : "white";
          const textColor = backgroundColor === "white" ? "black" : "white";

          return (
            <Pressable
              style={styles.card}
              onPress={() => changePageAndSendUriProfile(item.uri)}
            >
              <Card style={[styles.cardContainer, { backgroundColor }]}>
                {item.image ? (
                  <Card.Cover
                    source={item.image}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.image, styles.center]}>
                    <Text style={{ color: textColor }}>Sin imagen</Text>
                  </View>
                )}

                <Card.Content style={styles.cardContent}>
                  <Text style={[styles.placeName, { color: textColor }]} numberOfLines={1}>
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
    borderRadius: 0,
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
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default Posts;