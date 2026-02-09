import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
    
      {/* 🖼️ Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Lugares de la Semana</Text>
      </View>

      {/* 👥 Amigos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Amigos</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.friends}
      >
        {["PeterNFS", "ChentePro", "Licenia", "Miguel", "David","ChentePro"].map((name, i) => (
          <View key={i} style={styles.friendItem}>
            <View style={styles.avatar} />
            <Text style={styles.friendName}>{name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 🌍 Explorar */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explorar</Text>
      </View>

      <View style={styles.grid}>
        {[1, 2, 3, 4].map((item) => (
          <View key={item} style={styles.card}>
            <View style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text>Sevilla</Text>
              <Text>4.5/5</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },

  searchContainer: {
    width: "100%",
    height: "6%",
    justifyContent: "center",
    alignItems: "center",
  },

  searchInput: {
    width: "90%",
    height: "70%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: "5%",
  },

  filters: {
    width: "100%",
    height: "6%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  filterBtn: {
    width: "28%",
    height: "65%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  banner: {
    width: "95%",
    height: "18%",
    alignSelf: "center",
    borderRadius: 12,
    backgroundColor: "#bbb",
    justifyContent: "flex-end",
    padding: "5%",
  },

  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionHeader: {
    width: "90%",
    height: "5%",
    alignSelf: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  friends: {
    width: "100%",
    height: "14%",
    paddingLeft: "5%",
  },

  friendItem: {
    width: 70,
    marginRight: 15,
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },

  friendName: {
    fontSize: 12,
    marginTop: 5,
  },

  grid: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  card: {
    width: "45%",
    height: "45%",
    borderRadius: 12,
    backgroundColor: "#eee",
    marginBottom: "5%",
  },

  cardImage: {
    width: "100%",
    height: "70%",
    backgroundColor: "#bbb",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  cardInfo: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
  },

  bottomNav: {
    width: "100%",
    height: "7%",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

