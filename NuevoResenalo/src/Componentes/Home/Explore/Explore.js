import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importando Ionicons

const Explore = ({ navigation, places }) => {
  const items = places.slice(0, 4);

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("ListPlace")}
      >
        <Text style={styles.title}>Explorar</Text>
        <Ionicons name="chevron-forward-outline" size={25} color="#000000" />
      </Pressable>

      <View style={styles.grid}>
        {items.map((p) => (
          <Pressable
            key={p.id}
            style={styles.card}
            onPress={() => navigation.navigate("Place")}
          >
            <Image
              source={require("../../../../assets/images/Konoha.png")}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.footer}>
              <Text style={styles.place} numberOfLines={1}>
                {p.title}
              </Text>
              <Text style={styles.rating}>{p.rating}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginLeft: 6,
  },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  card: {
    width: "48%",
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
    aspectRatio: 1.2,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "6%",
    paddingVertical: "5%",
    backgroundColor: "#2654d1",
  },
  place: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
});
