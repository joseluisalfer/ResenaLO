import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../../services/services";
import Context from "../../../Context/Context";

const WeekPlace = ({ navigation }) => {
  const [podiumData, setPodiumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSearchUrl } = useContext(Context);

  const obtainData = async () => {
    try {
      setLoading(true);
      const urls = await getData("http://44.213.235.160:8080/resenalo/top3Reviews");
      if (urls && urls.length >= 3) {
        const details = await Promise.all(urls.map(url => getData(url)));
        
        const rawItems = details.map((data, index) => ({
          data,
          url: urls[index],
          rank: index + 1
        })).filter(item => item.data !== null);

        const ordered = [rawItems[1], rawItems[0], rawItems[2]];
        setPodiumData(ordered);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    obtainData();
  }, []);

  const handlePressPlace = (url) => {
    setSearchUrl(url);
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
              let barStyle = styles.bronze;
              if (item.rank === 1) barStyle = styles.gold;
              else if (item.rank === 2) barStyle = styles.silver;

              return (
                <Pressable 
                  key={index} 
                  style={styles.podiumItem}
                  onPress={() => handlePressPlace(item.url)}
                >
                  <Text style={styles.rank}>{item.rank}</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, barStyle]} />
                  </View>
                  <Text style={styles.place} numberOfLines={1}>{item.data.title}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={styles.titleWrapper}
          onPress={() => navigation.navigate("Podium")}
        >
          <Text style={styles.title}>Top 10 lugares</Text>
          <Ionicons name="chevron-forward-outline" size={25} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: "#2654d1",
    borderRadius: 14,
    padding: "4%",
    justifyContent: "space-between",
    marginTop: 15, 
    minHeight: 180,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: "2%",
    flex: 1,
    marginBottom: 10, 
  },
  podiumItem: {
    width: "30%",
    alignItems: "center",
  },
  rank: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    marginBottom: 6,
  },
  barContainer: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 10,
  },
  gold: {
    height: 100, 
    backgroundColor: "#ffd549",
  },
  silver: {
    height: 70,
    backgroundColor: "#e7e7e7",
  },
  bronze: {
    height: 45,
    backgroundColor: "#d48332",
  },
  place: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
    textAlign: 'center',
    width: '100%',
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  }
});

export default WeekPlace;