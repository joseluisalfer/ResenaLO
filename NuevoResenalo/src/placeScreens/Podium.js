import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next'
import '../../assets/i18n/index';


const mockPodium = [
  { id: "1", name: "Sevilla", rating: "4.8/5" },
  { id: "2", name: "Murcia", rating: "4.7/5" },
  { id: "3", name: "Madrid", rating: "4.6/5" },
  { id: "4", name: "Valencia", rating: "4.5/5" },
  { id: "5", name: "Barcelona", rating: "4.4/5" },
  { id: "6", name: "Granada", rating: "4.3/5" },
  { id: "7", name: "Bilbao", rating: "4.2/5" },
  { id: "8", name: "Sevilla Este", rating: "4.1/5" },
  { id: "9", name: "Alicante", rating: "4.0/5" },
  { id: "10", name: "Zaragoza", rating: "3.9/5" },
];

const Podium = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
 
  const renderPodiumItem = ({ item, index }) => {
    const podiumStyles = [styles.podiumItem];
    if (index === 0) {
      podiumStyles.push(styles.gold);
    } else if (index === 1) {
      podiumStyles.push(styles.silver);
    } else if (index === 2) {
      podiumStyles.push(styles.bronze);
    }
    return (
      <Pressable
        style={podiumStyles}
        onPress={() => navigation.navigate("Place", { placeId: item.id })}
      >
        <Image
          source={require("../../assets/images/Konoha.png")}
          style={styles.podiumImage}
        />
        <View style={styles.podiumDetails}>
          <Text style={styles.place}>{item.name}</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
      </Pressable>
    );
  };

  const renderOtherPlaces = ({ item, index }) => (
    <Pressable
      onPress={() => navigation.navigate("Place", { placeId: item.id })}
      style={styles.card}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardNumber}>{index + 4}#</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.placeRating}>{item.rating}</Text>
        </View>
        <Image
          source={require("../../assets/images/Konoha.png")}
          style={styles.cardImage}
        />
      </Card.Content>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-back"
        marginTop="5%"
        size={30}
        color="black"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />

      <Text style={styles.title}>{t("placeScreen.podium")}</Text>

      <View style={styles.podium}>
        <View style={styles.podiumRow}>
          <View style={styles.podiumItemContainerLeft}>
            {renderPodiumItem({ item: mockPodium[1], index: 1 })}
          </View>
          <View style={styles.podiumItemContainerCenter}>
            {renderPodiumItem({ item: mockPodium[0], index: 0 })}
          </View>
          <View style={styles.podiumItemContainerRight}>
            {renderPodiumItem({ item: mockPodium[2], index: 2 })}
          </View>
        </View>
      </View>

      <Text style={styles.subTitle}>{t("placeScreen.anotherText")}</Text>

      <FlatList
        data={mockPodium.slice(3)}
        renderItem={renderOtherPlaces}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.otherPlacesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  podium: {
    marginBottom: 30,
  },
  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  podiumItemContainerLeft: {
    flex: 1,
    alignItems: "center",
  },
  podiumItemContainerCenter: {
    flex: 1,
    alignItems: "center",
  },
  podiumItemContainerRight: {
    flex: 1,
    alignItems: "center",
  },
  podiumItem: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    marginVertical: 10,
  },
  gold: {
    backgroundColor: "#ffd700",
    padding: 20,
  },
  silver: {
    backgroundColor: "#c0c0c0",
    padding: 20,
  },
  bronze: {
    backgroundColor: "#cd7f32",
    padding: 20,
  },
  podiumImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  podiumDetails: {
    marginTop: 10,
    alignItems: "center",
  },
  place: {
    fontSize: 16,
    color: "#fff",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  rating: {
    fontSize: 14,
    color: "#fff",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginTop: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    width: "95%",
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeader: {
    flex: 1,
    alignItems: "flex-start",
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  cardDetails: {
    flex: 3,
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 5,
  },
  placeRating: {
    fontSize: 14,
    color: "gray",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 10,
  },
  podiumList: {
    marginBottom: 20,
  },
  otherPlacesList: {
    paddingBottom: 20,
  },
});

export default Podium;
