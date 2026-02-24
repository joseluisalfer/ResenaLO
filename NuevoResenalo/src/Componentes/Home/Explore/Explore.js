import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../../services/Services";
import Context from "../../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * Explore Component: Displays a grid of random reviews to discover new places
 */
const Explore = ({ navigation }) => {
  const [reviewsUrls, setReviewsUrls] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { setSearchUrl, theme, isDark } = useContext(Context);

  /**
   * Fetches a list of random review URLs from the server
   */
  const fetchUrls = async () => {
    try {
      const data = await getData(
        "http://44.213.235.160:8080/resenalo/randomReviews",
      );
      if (data) setReviewsUrls(data);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  /**
   * Resolves all URLs to fetch full review details
   */
  useEffect(() => {
    if (reviewsUrls.length > 0) {
      const fetchReviewDetails = async () => {
        try {
          const reviews = await Promise.all(
            reviewsUrls.map((url) => getData(url)),
          );
          setReviewsData(reviews.filter((r) => r !== null));
        } catch (error) {
          // Handle error silently to maintain user experience
        } finally {
          setLoading(false);
        }
      };
      fetchReviewDetails();
    }
  }, [reviewsUrls]);

  // Refresh data when the screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      fetchUrls();
    }, []),
  );

  const handleOnPress = (url) => {
    setSearchUrl(url);
    navigation.navigate("Place");
  };

  if (loading) {
    return (
      <View
        style={[styles.loadingWrapper, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color="#2654d1" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header section navigating to the full list */}
      <Pressable
        style={styles.header}
        onPress={() => navigation?.navigate("ListPlace")}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {t("home.buttonExplorer")}
        </Text>
        <Ionicons name="chevron-forward-outline" size={25} color={theme.text} />
      </Pressable>

      {/* Grid of discovery cards */}
      <View style={styles.grid}>
        {reviewsData.map((review, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.card,
              {
                opacity: pressed ? 0.8 : 1,
                backgroundColor: isDark ? "#1e1e1e" : "#fff",
                shadowColor: "#000",
              },
            ]}
            onPress={() => handleOnPress(review.review)}
          >
            <Image
              source={{ uri: review.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.footer}>
              <Text style={styles.place} numberOfLines={1}>
                {review.title}
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>
                  {Number(review.valoration).toFixed(1)}
                </Text>
                <Ionicons
                  name="star"
                  size={13}
                  color="#FFD700"
                  style={{ marginLeft: 3 }}
                />
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 5 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: "4%",
  },
  title: { fontSize: 22, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: "4%",
    paddingBottom: 20,
  },
  card: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: "100%", height: 120 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2654d1",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  place: { fontSize: 14, fontWeight: "bold", color: "#ffffff", flex: 1 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  rating: { fontSize: 14, fontWeight: "bold", color: "#ffffff" },
  loadingWrapper: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Explore;
