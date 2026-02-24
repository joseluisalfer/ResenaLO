import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../../services/Services";
import Context from "../../../Context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

/**
 * WeekPlace Component: Displays a visual "Top 3" podium of the week's best reviews
 */
const WeekPlace = ({ navigation }) => {
  const [podiumData, setPodiumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSearchUrl } = useContext(Context);
  const { t } = useTranslation();

  /**
   * Fetches the Top 3 review URLs and their corresponding details
   */
  const obtainData = async () => {
    try {
      setLoading(true);
      const urls = await getData(
        "http://44.213.235.160:8080/resenalo/top3Reviews",
      );

      if (urls && urls.length >= 3) {
        const details = await Promise.all(urls.map((url) => getData(url)));

        // Map data with rank and filter out null responses
        const rawItems = details
          .map((data, index) => ({
            data,
            url: urls[index],
            rank: index + 1,
          }))
          .filter((item) => item.data !== null);

        // Reorder items to display visually as: [Rank 2, Rank 1, Rank 3]
        const ordered = [rawItems[1], rawItems[0], rawItems[2]];
        setPodiumData(ordered);
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtainData();
  }, []);

  // Refresh podium data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      obtainData();
    }, []),
  );

  const handlePressPlace = (reviewUrl) => {
    setSearchUrl(reviewUrl);
    navigation.navigate("Place");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <View style={styles.podiumRow}>
            {podiumData.map((item, index) => {
              if (!item) return null;

              // Visual logic for podium bar heights and colors
              let barHeight = 65;
              let borderColor = "#d48332"; // Bronze/Default

              if (item.rank === 1) {
                barHeight = 115;
                borderColor = "#ffd549"; // Gold
              } else if (item.rank === 2) {
                barHeight = 90;
                borderColor = "#e7e7e7"; // Silver
              }

              return (
                <Pressable
                  key={index}
                  style={styles.podiumItem}
                  onPress={() => handlePressPlace(item.data.review)}
                >
                  <Text style={styles.rankTop}>{item.rank}</Text>
                  <View
                    style={[
                      styles.bar,
                      { height: barHeight, borderColor: borderColor },
                    ]}
                  >
                    {item.data.image ? (
                      <Image
                        source={{ uri: item.data.image }}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.centerIcon}>
                        <Ionicons name="image-outline" size={20} color="#fff" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.place} numberOfLines={1}>
                    {item.data.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={styles.titleWrapper}
          onPress={() => navigation.navigate("Podium")}
        >
          <Text style={styles.title}>{t("placeScreen.buttonPodium")}</Text>
          <Ionicons name="chevron-forward-outline" size={25} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  card: {
    flex: 1,
    backgroundColor: "#2654d1",
    borderRadius: 14,
    padding: "4%",
    justifyContent: "space-between",
    marginTop: 15,
    minHeight: 230,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: "2%",
    flex: 1,
    marginBottom: 5,
  },
  podiumItem: { width: "30%", alignItems: "center" },
  rankTop: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 4 },
  bar: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 3,
    overflow: "hidden",
    backgroundColor: "#1a3a8f",
  },
  image: { width: "100%", height: "100%" },
  centerIcon: { flex: 1, justifyContent: "center", alignItems: "center" },
  place: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
    width: "100%",
  },
  titleWrapper: { flexDirection: "row", alignItems: "center", paddingTop: 10 },
  title: { fontSize: 18, fontWeight: "700", color: "#ffffff" },
});

export default WeekPlace;
