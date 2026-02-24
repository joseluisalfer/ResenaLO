import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../services/Services";
import Context from "../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * Podium Component: Displays the top 10 rated reviews.
 * The top 3 are featured in a visual podium (Gold, Silver, Bronze),
 * while the remaining 7 are listed in a standard ranked list.
 */
const Podium = ({ navigation }) => {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSearchUrl, theme, isDark } = useContext(Context);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        setLoading(true);
        // Fetch the list of URLs for the top 10 reviews
        const urls = await getData(
          "http://44.213.235.160:8080/resenalo/top10Reviews",
        );

        if (urls && Array.isArray(urls)) {
          // Fetch details for each review concurrently
          const details = await Promise.all(
            urls.map(async (url) => {
              try {
                const res = await getData(url);
                return res ? { ...res, originalUrl: url } : null;
              } catch (e) {
                return null;
              }
            }),
          );
          setTop10(details.filter((item) => item !== null));
        }
      } catch (error) {
        console.error("Error fetching podium data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTop10();
  }, []);

  const handlePress = (url) => {
    setSearchUrl(url);
    navigation.navigate("Place");
  };

  /**
   * Renders the top 3 items with specific metal-themed backgrounds.
   * Note: Text remains dark on these items for readability against bright colors.
   */
  const renderPodiumItem = ({ item, index }) => {
    const podiumStyles = [styles.podiumItem];
    if (index === 0) podiumStyles.push(styles.gold);
    else if (index === 1) podiumStyles.push(styles.silver);
    else if (index === 2) podiumStyles.push(styles.bronze);

    return (
      <Pressable style={podiumStyles} onPress={() => handlePress(item.review)}>
        <Image source={{ uri: item.image }} style={styles.podiumImage} />
        <View style={styles.podiumDetails}>
          <Text style={styles.place} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>{item.valoration}</Text>
            <Ionicons
              name="star"
              size={14}
              color="#000"
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  /**
   * Renders places 4 through 10 in a themed card format.
   */
  const renderOtherPlaces = ({ item, index }) => (
    <Pressable
      onPress={() => handlePress(item.review)}
      style={[
        styles.card,
        {
          backgroundColor: isDark ? "#1e1e1e" : "#fff",
          borderColor: isDark ? "#333" : "#eee",
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardNumber, { color: theme.text }]}>
            {index + 4}#
          </Text>
        </View>
        <View style={styles.cardDetails}>
          <Text
            style={[styles.placeName, { color: theme.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <View style={styles.ratingRow}>
            <Text
              style={[styles.placeRating, { color: isDark ? "#aaa" : "#444" }]}
            >
              {item.valoration}
            </Text>
            <Ionicons
              name="star"
              size={14}
              color="#FFD700"
              style={{ marginLeft: 4 }}
            />
          </View>
        </View>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary || "#2654d1"} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Ionicons
        name="arrow-back"
        size={30}
        color={theme.text}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />

      <Text style={[styles.title, { color: theme.text }]}>
        {t("placeScreen.headerPodium")}
      </Text>

      {/* Podium Visualization (Top 3) */}
      {top10.length >= 3 && (
        <View style={styles.podium}>
          <View style={styles.podiumRow}>
            {/* 2nd Place (Silver) */}
            <View style={styles.podiumItemContainer}>
              {renderPodiumItem({ item: top10[1], index: 1 })}
            </View>
            {/* 1st Place (Gold) */}
            <View style={styles.podiumItemContainer}>
              {renderPodiumItem({ item: top10[0], index: 0 })}
            </View>
            {/* 3rd Place (Bronze) */}
            <View style={styles.podiumItemContainer}>
              {renderPodiumItem({ item: top10[2], index: 2 })}
            </View>
          </View>
        </View>
      )}

      <Text style={[styles.subTitle, { color: theme.text }]}>
        {t("placeScreen.anotherPlace")}
      </Text>

      {/* List for places 4-10 */}
      <FlatList
        data={top10.slice(3)}
        renderItem={renderOtherPlaces}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.otherPlacesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 45, paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { marginBottom: 10, width: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  podium: { marginBottom: 20, marginTop: 10 },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  podiumItemContainer: { flex: 1, alignItems: "center" },
  podiumItem: {
    width: "92%",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gold: { backgroundColor: "#FFD700", height: 180, justifyContent: "center" },
  silver: { backgroundColor: "#C0C0C0", height: 150, justifyContent: "center" },
  bronze: { backgroundColor: "#CD7F32", height: 130, justifyContent: "center" },
  podiumImage: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  podiumDetails: { marginTop: 10, alignItems: "center", paddingHorizontal: 5 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  place: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  rating: { fontSize: 13, fontWeight: "bold", color: "#000" },
  subTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
  card: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
  },
  cardContent: { flexDirection: "row", alignItems: "center" },
  cardHeader: { width: 50 },
  cardNumber: { fontSize: 22, fontWeight: "bold" },
  cardDetails: { flex: 1, paddingLeft: 5 },
  placeName: { fontSize: 16, fontWeight: "bold" },
  placeRating: { fontSize: 14, fontWeight: "600" },
  cardImage: { width: 55, height: 55, borderRadius: 12 },
  otherPlacesList: { paddingBottom: 40 },
});

export default Podium;
