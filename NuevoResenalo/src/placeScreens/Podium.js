import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Image, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../services/Services";
import Context from "../Context/Context";
import { useTranslation } from "react-i18next";
const Podium = ({ navigation }) => {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSearchUrl, theme, isDark } = useContext(Context);
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        const urls = await getData("http://44.213.235.160:8080/resenalo/top10Reviews");
        if (urls) {
          const details = await Promise.all(
            urls.map(async (url) => {
              const res = await getData(url);
              return { ...res, originalUrl: url };
            })
          );
          setTop10(details.filter(item => item !== null));
        }
      } catch (error) {
        console.error(error);
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

  const renderPodiumItem = ({ item, index }) => {
    const podiumStyles = [styles.podiumItem];
    if (index === 0) podiumStyles.push(styles.gold);
    else if (index === 1) podiumStyles.push(styles.silver);
    else if (index === 2) podiumStyles.push(styles.bronze);

    return (
      <Pressable
        style={podiumStyles}
        onPress={() => handlePress(item.review)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.podiumImage}
        />
        <View style={styles.podiumDetails}>
          {/* El texto sobre el podio siempre debe ser oscuro para contraste con el Oro/Plata/Bronce */}
          <Text style={styles.place} numberOfLines={1}>{item.title}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>{item.valoration}</Text>
            <Ionicons name="star" size={14} color="#000" style={{ marginLeft: 2 }} />
          </View>
        </View>
      </Pressable>
    );
  };

  const renderOtherPlaces = ({ item, index }) => (
    <Pressable
      onPress={() => handlePress(item.review)}
      style={[
        styles.card, 
        { 
            backgroundColor: isDark ? "#1e1e1e" : "#fff", 
            borderColor: isDark ? "#333" : "#eee" 
        }
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardNumber, { color: theme.text }]}>{index + 4}#</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={[styles.placeName, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
          <View style={styles.ratingRow}>
            <Text style={[styles.placeRating, { color: isDark ? "#aaa" : "#444" }]}>{item.valoration}</Text>
            <Ionicons name="star" size={14} color="#FFD700" style={{ marginLeft: 4 }} />
          </View>
        </View>
        <Image
          source={{ uri: item.image }}
          style={styles.cardImage}
        />
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#2654d1" />
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

      <Text style={[styles.title, { color: theme.text }]}>{t('placeScreen.headerPodium')}</Text>

      {top10.length >= 3 && (
        <View style={styles.podium}>
          <View style={styles.podiumRow}>
            <View style={styles.podiumItemContainerLeft}>
              {renderPodiumItem({ item: top10[1], index: 1 })}
            </View>
            <View style={styles.podiumItemContainerCenter}>
              {renderPodiumItem({ item: top10[0], index: 0 })}
            </View>
            <View style={styles.podiumItemContainerRight}>
              {renderPodiumItem({ item: top10[2], index: 2 })}
            </View>
          </View>
        </View>
      )}

      <Text style={[styles.subTitle, { color: theme.text }]}>{t('placeScreen.anotherPlace')}</Text>

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
  container: {
    flex: 1,
    paddingTop: 45,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 10,
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  podium: {
    marginBottom: 20,
    marginTop: 10,
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  podiumItemContainerLeft: { flex: 1, alignItems: "center" },
  podiumItemContainerCenter: { flex: 1, alignItems: "center" },
  podiumItemContainerRight: { flex: 1, alignItems: "center" },
  podiumItem: {
    width: '92%',
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gold: { backgroundColor: "#FFD700", height: 180, justifyContent: 'center' },
  silver: { backgroundColor: "#C0C0C0", height: 150, justifyContent: 'center' },
  bronze: { backgroundColor: "#CD7F32", height: 130, justifyContent: 'center' },
  podiumImage: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  podiumDetails: {
    marginTop: 10,
    alignItems: "center",
    paddingHorizontal: 5
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  place: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#000", // Mantenemos negro para leer sobre metalizados
    textAlign: 'center'
  },
  rating: {
    fontSize: 13,
    fontWeight: 'bold',
    color: "#000",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 15,
  },
  card: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeader: { width: 50 },
  cardNumber: {
    fontSize: 22,
    fontWeight: "bold",
  },
  cardDetails: {
    flex: 1,
    paddingLeft: 5,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  placeRating: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardImage: {
    width: 55,
    height: 55,
    borderRadius: 12,
  },
  otherPlacesList: {
    paddingBottom: 40,
  },
});

export default Podium;