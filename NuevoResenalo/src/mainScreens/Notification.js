import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Notification = ({ navigation }) => {
  const [friends, setFriends] = useState([
    {
      id: "1",
      name: "David Serrano",
      image: require("../../assets/images/DavidCaganer.jpeg"),
      friendsCount: 150,
    },
    {
      id: "2",
      name: "Samuel Rodriguez",
      image: require("../../assets/images/SamuDown.jpeg"),
      friendsCount: 120,
    },
    {
      id: "3",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      friendsCount: 75,
    },
    {
      id: "4",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      friendsCount: 200,
    },
    {
      id: "5",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      friendsCount: 180,
    },
    {
      id: "6",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      friendsCount: 100,
    },
    {
      id: "7",
      name: "Catarroja Plaza",
      image: require("../../assets/images/CatarrojaPlaza.jpg"),
      friendsCount: 190,
    },
    {
      id: "8",
      name: "Catarroja Parque",
      image: require("../../assets/images/CatarrojaParque.jpg"),
      friendsCount: 150,
    },
    {
      id: "9",
      name: "Catarroja Fuente",
      image: require("../../assets/images/CatarrojaFuente.jpg"),
      friendsCount: 110,
    },
  ]);

  const alternateProfiles = (friendsArray) => {
    const firstTwo = friendsArray.slice(0, 2);
    const rest = friendsArray.slice(2);
    return [...firstTwo.reverse(), ...rest];
  };

  const alternatingFriends = alternateProfiles(friends);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificaciones</Text>
      </View>
      <View style={{ width: "100%" }}>
        <FlatList
          data={alternatingFriends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable onPress={() => navigation.navigate("Friend", { friendId: item.id })}>
              <View style={styles.item}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.placeName}>{item.name}</Text>
                  <Text style={styles.followingText}>ha comenzado a seguirte</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: "30%",
    width: "100%",
    justifyContent: "center", 
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: 'center',
    width: "100%", 
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start", 
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: 'left',
  },
  followingText: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
    textAlign: 'left', 
  },
  friendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    justifyContent: "flex-start", 
  },
  friendsText: {
    fontSize: 16,
    color: "#777",
    marginLeft: 5,
    textAlign: 'left', 
  },
});

export default Notification;
