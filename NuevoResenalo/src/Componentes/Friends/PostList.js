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

/**
 * Posts Component: Displays a grid of reviews/places for a selected friend
 */
const PostList = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedFriend, setSearchUrl, theme, isDark } = useContext(Context);

  /**
   * Converts raw image data (URL or Base64) into a valid URI string
   */
  const normalizeImageToUri = (imgRaw) => {
    const first = Array.isArray(imgRaw) ? imgRaw[0] : imgRaw;
    const value =
      typeof first === "string" ? first : first?.url ? first.url : null;

    if (!value || typeof value !== "string") return PLACEHOLDER_IMG;
    if (value.startsWith("http") || value.startsWith("data:image"))
      return value;

    const cleanBase64 = value.replace(/[^A-Za-z0-9+/=]/g, "");
    return `data:image/jpeg;base64,${cleanBase64}`;
  };

  /**
   * Updates global search URL and navigates to the Place detail screen
   */
  const changePageAndSendUri = (uri) => {
    setSearchUrl(uri);
    navigation.navigate("Place");
  };

  /**
   * Fetches detailed review data from a list of URLs
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewUrls =
        selectedFriend?.reviews ?? selectedFriend?.results?.reviews ?? [];

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
              name: reviewData?.title ?? reviewData?.type ?? "Untitled",
              image: { uri: normalizeImageToUri(reviewData?.images) },
              rating: reviewData?.valoration ?? 0,
              uri: url,
            };
          } catch (e) {
            return {
              id: `error_${index}_${url}`,
              name: "Load Error",
              image: { uri: PLACEHOLDER_IMG },
              rating: 0,
              uri: url,
            };
          }
        }),
      );
      setPlaces(reviewDetails.filter(Boolean));
    } catch (error) {
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
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#1748ce" />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <FlatList
        key={selectedFriend?.id ?? selectedFriend?.results?.id ?? "no_friend"}
        data={places}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          // Dynamic color logic based on item index and theme
          const isThirdCard = index % 3 === 2;
          const backgroundColor =
            index % 3 === 0
              ? "#1748ce"
              : index % 3 === 1
                ? "#DC3545"
                : isDark
                  ? "#1e1e1e"
                  : "white";

          const textColor = isThirdCard ? theme.text : "white";

          return (
            <Pressable
              style={styles.card}
              onPress={() => changePageAndSendUri(item.uri)}
            >
              <Card
                style={[
                  styles.cardContainer,
                  {
                    backgroundColor,
                    borderColor: isDark ? "#333" : "transparent",
                    borderWidth: isDark ? 1 : 0,
                  },
                ]}
              >
                <Card.Cover
                  source={item.image}
                  style={styles.image}
                  resizeMode="cover"
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
            <Text
              style={[styles.emptyText, { color: isDark ? "#777" : "#aaa" }]}
            >
              No reviews available
            </Text>
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
    width: "100%",
  },
  card: {
    flex: 1,
    margin: 8,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    height: 210,
    elevation: 4,
  },
  image: {
    height: 120,
    width: "100%",
  },
  cardContent: {
    padding: 10,
    justifyContent: "space-between",
  },
  placeName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rating: {
    fontSize: 13,
    marginTop: 4,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostList;
