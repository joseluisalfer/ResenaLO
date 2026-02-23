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

const ListPlace = ({ navigation }) => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [shownPlaces, setShownPlaces] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  
  // 1. Extraemos theme e isDark del Contexto
  const { setSearchUrl, theme, isDark } = useContext(Context);

  const changePageAndSendUri = (uri) => {
    setSearchUrl(uri);
    navigation.navigate("Place");
  };

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
            return null;
          }
        })
      );

      const clean = reviewDetails.filter(Boolean);
      setPlaces(clean);
      setShownPlaces(clean);
    } catch (error) {
      console.error("Error al obtener las reseñas:", error);
      setPlaces([]);
      setShownPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const q = searchText.trim().toLowerCase();
    if (!q) {
      setShownPlaces(places);
      return;
    }
    const result = places.filter((p) =>
      (p.name || "").toLowerCase().includes(q)
    );
    setShownPlaces(result);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setShownPlaces(places);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (!searchText.trim()) setShownPlaces(places);
  }, [places]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#1748ce" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color={theme.text} // Icono dinámico
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />

        <Text style={[styles.title, { color: theme.text }]}>
          {t("buttonExplorer.list")}
        </Text>

        <View style={styles.rightSpacer} />
      </View>

      {/* SEARCHBAR DINÁMICA */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por título..."
          placeholderTextColor={isDark ? "#AAA" : "#666"}
          value={searchText}
          onChangeText={setSearchText}
          onIconPress={handleSearch}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          style={[
            styles.searchBarPaper, 
            { backgroundColor: isDark ? "#1E1E1E" : "#f0f0f0" }
          ]}
          inputStyle={[styles.searchInput, { color: theme.text }]}
          iconColor={theme.text}
          clearIcon="close"
          onClearIconPress={handleClearSearch}
        />
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={shownPlaces}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => changePageAndSendUri(item.ruta)}>
              <View style={[
                styles.item, 
                { 
                  backgroundColor: isDark ? "#121212" : "#f8f8f8",
                  borderColor: isDark ? "#333" : "#ddd"
                }
              ]}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.rating, { color: isDark ? "#AAA" : "#777" }]}>⭐ {item.rating}</Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={50} color={isDark ? "#444" : "#ccc"} />
              <Text style={[styles.emptyText, { color: isDark ? "#888" : "#666" }]}>
                {searchText.trim()
                  ? "No se encontraron reseñas con ese título"
                  : "No hay reseñas para mostrar"}
              </Text>
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
    paddingHorizontal: 10,
    marginBottom: "15%",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    paddingTop: "12%",
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
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  searchBarPaper: {
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    fontSize: 16,
    minHeight: 40,
  },
  listWrapper: { width: "100%", marginBottom: "10%" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
  },
  image: { width: "50%", height: 100, borderRadius: 10, marginRight: 15 },
  textContainer: { flex: 1 },
  placeName: { fontSize: 18, fontWeight: "bold" },
  rating: { fontWeight: "bold", fontSize: 20 },
  emptyBox: { alignItems: "center", padding: 30 },
  emptyText: { marginTop: 10, textAlign: "center" },
});

export default ListPlace;