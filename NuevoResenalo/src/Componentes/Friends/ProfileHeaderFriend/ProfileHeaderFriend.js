import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
const ProfileHeaderFriend = ({ navigation }) => {

  const [isChecked, setIschecked] = useState(true)
  const [colorChecked, setColorchecked] = useState(true);
  const [follow, setFollow] = useState(true)
  const following = () => {
    setIschecked(!isChecked);
    setColorchecked(!colorChecked)
    setFollow(!follow)
  }

  return (
    <View style={styles.container}>
      {/* Back Button (Positioned to the left) */}
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
      {/* Checkmark Icon (Positioned to the top-right) */}
      <Ionicons
        name={isChecked ? "checkmark" : "close" ? "close" : "checkmark"}
        size={30}
        color={colorChecked ? "green" : "red" }
        style={styles.checkmarkIcon}
        onPress={() => following()}
      />


      <View style={styles.profileImageContainer}>
        <Image
          source={require("../../../../assets/images/Konoha.png")}
          style={styles.profileImage}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text variant="bodyMedium" style={styles.username}>
          @مثلي الجنس
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text variant="headlineSmall" style={styles.name}>
          Aymane El Hamoudi
        </Text>

        <Text variant="bodyMedium" style={styles.ubication}>
          Catarroja, España
        </Text>

        <Text variant="bodyMedium" style={styles.bio}>
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
    position: "relative", // Make the parent container relative for absolute positioning
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  checkmarkIcon: {
    position: "absolute",
    marginTop: 35,
    right: 23, // Position it at the top-right corner
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
  },
  name: {
    marginTop: 12,
    fontWeight: "bold",
  },
  username: {
    color: "gray",
    marginTop: 3,
  },
  ubication: {
    color: "gray",
    marginTop: 0,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  containerFollowing:{
    right: 10, 
    position: "absolute", 
    marginTop: 8,
  },
  textFollowing: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black"
  }
});

export default ProfileHeaderFriend;
