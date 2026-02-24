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
import { getData } from "../services/Services";
import Context from "../Context/Context";
import { Searchbar } from "react-native-paper";

/**
 * ListPlace Screen: Fetches and displays a searchable list of all public reviews.
 * Includes a robust loading state and handles deep-linking to specific place details.
 */
const ListPlace = ({ navigation }) => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [shownPlaces, setShownPlaces] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const { setSearchUrl, theme, isDark } = useContext(Context);

  /**
   * Updates global context with the selected review URL and navigates to details.
   */
  const changePageAndSendUri = (uri) => {
    setSearchUrl(uri);
    navigation.navigate("Place");
  };

  /**
   * Orchestrates fetching the main review list and individual review details.
   * Uses Promise.all to fetch metadata for all reviews concurrently.
   */
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getData("http://44.213.235.160:8080/resenalo/reviews");
      const reviewUrls = data.reviews;

      if (!Array.isArray(reviewUrls) || reviewUrls.length === 0) {
        setPlaces([]);
        setShownPlaces([]);
        return;
      }

      const reviewDetails = await Promise.all(
        reviewUrls.map(async (url, index) => {
          try {
            const reviewData = await getData(url);
            return {
              id: index,
              name: reviewData.title,
              image: { uri: reviewData.image },
              rating: reviewData?.valoration,
              ruta: reviewData.review,
            };
          } catch {
            return null; // Skip reviews that fail to load
          }
        }),
      );

      const cleanList = reviewDetails.filter(Boolean);
      setPlaces(cleanList);
      setShownPlaces(cleanList);
    } catch (error) {
      console.error("Error fetching reviews list:", error);
      setPlaces([]);
      setShownPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filters the master list of places based on text input.
   */
  const handleSearch = () => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      setShownPlaces(places);
      return;
    }
    const filtered = places.filter((p) =>
      (p.name || "").toLowerCase().includes(query),
    );
    setShownPlaces(filtered);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setShownPlaces(places);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Update list dynamically as the user types
  useEffect(() => {
    handleSearch();
  }, [searchText]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary || "#1748ce"} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Dynamic Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color={theme.text}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.title, { color: theme.text }]}>
          {t("buttonExplorer.list")}
        </Text>
        <View style={styles.rightSpacer} />
      </View>

      {/* Search Input Area */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={t("buttonExplorer.searchHolder")}
          placeholderTextColor={isDark ? "#AAA" : "#666"}
          value={searchText}
          onChangeText={setSearchText}
          onIconPress={handleSearch}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          style={[
            styles.searchBarPaper,
            { backgroundColor: isDark ? "#1E1E1E" : "#f0f0f0" },
          ]}
          inputStyle={[styles.searchInput, { color: theme.text }]}
          iconColor={theme.text}
          clearIcon="close"
          onClearIconPress={handleClearSearch}
        />
      </View>

      {/* Review List */}
      <FlatList
        data={shownPlaces}
        keyExtractor={(item) => item.id.toString()}
        // Bottom padding allows scrolling past fixed UI elements like TabBars
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => changePageAndSendUri(item.ruta)}>
            <View
              style={[
                styles.item,
                {
                  backgroundColor: isDark ? "#1E1E1E" : "#f8f8f8",
                  borderColor: isDark ? "#333" : "#ddd",
                },
              ]}
            >
              <Image source={item.image} style={styles.image} />
              <View style={styles.textContainer}>
                <Text
                  style={[styles.placeName, { color: theme.text }]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
                <Text
                  style={[styles.rating, { color: isDark ? "#AAA" : "#777" }]}
                >
                  ⭐ {item.rating}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons
              name="search-outline"
              size={50}
              color={isDark ? "#444" : "#ccc"}
            />
            <Text
              style={[styles.emptyText, { color: isDark ? "#888" : "#666" }]}
            >
              {searchText.trim()
                ? `${t("buttonExplorer.errorSearch")} "${searchText}"`
                : t("buttonExplorer.noReview")}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 15,
  },
  backButton: { width: 30 },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  rightSpacer: { width: 30 },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchBarPaper: {
    borderRadius: 8,
    height: 45,
    elevation: 0,
    borderWidth: 1,
    borderColor: "transparent",
  },
  searchInput: {
    fontSize: 16,
    alignSelf: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  image: { width: "35%", height: 90, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1 },
  placeName: { fontSize: 18, fontWeight: "bold" },
  rating: { fontWeight: "bold", fontSize: 18, marginTop: 5 },
  emptyBox: { alignItems: "center", padding: 50 },
  emptyText: { marginTop: 10, textAlign: "center", fontSize: 16 },
});

export default ListPlace;
