import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileHeader = ({ navigation, username, name, location, bio }) => {
  return (
    <View style={styles.container}>
      <Ionicons 
        name="arrow-back" 
        size={30} 
        color="black" 
        style={styles.backButton} 
        onPress={() => navigation.goBack()} 
      />
      <View style={styles.profileImageContainer}>
        <Image source={require("../../../../assets/images/Konoha.png")} style={styles.profileImage} />
      </View>
      <View style={{ alignItems: "center" }}>
        <Text variant="bodyMedium" style={styles.username}>
          {username}
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text variant="headlineSmall" style={styles.name}>
          {name}
        </Text>
        <Text variant="bodyMedium" style={styles.ubication}>
          {location}
        </Text>
        <Text variant="bodyMedium" style={styles.bio}>
          {bio}
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
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
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
});

export default ProfileHeader;
