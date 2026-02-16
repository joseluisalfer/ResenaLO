import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getData } from "../../../services/services";

const ProfileHeaderFriend = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isChecked, setIsChecked] = useState(true);
  const [follow, setFollow] = useState(true);

  useEffect(() => {

    obtainData();
  }, []);

const obtainData = async () => {
      
        const data = await getData(
          "http://44.213.235.160:8080/first/userEmail?email=serranotarazonadavid@gmail.com"
        );
        setUser(data.results);
        
     
    };

  const following = () => {
    setIsChecked((prev) => !prev);
    setFollow((prev) => !prev);
  };

  // 1) Si viene URL jpg en results.photo la usamos
  // 2) Si viene base64, lo detectamos y añadimos prefijo
  const rawPhoto = user?.results?.photo || user?.photo || "";

  const imageUri = rawPhoto
    ? rawPhoto.startsWith("data:image")
      ? rawPhoto
      : rawPhoto.startsWith("http")
      ? rawPhoto
      : `data:image/jpeg;base64,${rawPhoto}`
    : null;

  return (
    <View style={styles.container}>
      <Ionicons
        name="arrow-back"
        size={30}
        color="black"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.containerFollowing}>
        <Text style={styles.textFollowing}>{follow ? "SEGUIR" : "SIGUIENDO"}</Text>
      </View>

      <Ionicons
        name={isChecked ? "checkmark" : "close"}
        size={30}
        color={isChecked ? "green" : "red"}
        style={styles.checkmarkIcon}
        onPress={following}
      />

      <View style={styles.profileImageContainer}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]} />
        )}
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={styles.username}>@{user.user}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={styles.name}>Aymane El Hamoudi</Text>
        <Text style={styles.ubication}>Catarroja, España</Text>
        <Text style={styles.bio}>
          Amante de ChatGPT | Portatil Nº8 | ¡Hazme un bizzum payo!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 40,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  checkmarkIcon: {
    position: "absolute",
    marginTop: 35,
    right: 23,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  placeholder: {
    backgroundColor: "#ddd",
  },
  name: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 20,
  },
  username: {
    color: "gray",
    marginTop: 3,
    fontSize: 20,
  },
  ubication: {
    color: "gray",
    marginTop: 0,
    fontSize: 20,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    fontSize: 20,
  },
  containerFollowing: {
    right: 10,
    position: "absolute",
    marginTop: 8,
  },
  textFollowing: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
});

export default ProfileHeaderFriend;
