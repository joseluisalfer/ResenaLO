import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Review = ({ name, comment, stars }) => {
  return (
    <View style={styles.container}>
      <View style={styles.commentBox}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.starsContainer}>
          <Text style={styles.starText}>{stars}</Text>
          <Ionicons name="star" size={18} color="#FFD700" /> 
        </View>

        <Text style={styles.comment}>{comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  commentBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 15,
    right: 15,
  },
  starText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
    color: "#000",
  },
  comment: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default Review;