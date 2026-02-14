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
          <Ionicons name="star" size={20} color="#000000" />
        </View>

        <Text style={styles.comment}>{comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  commentBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 15,
    right: 15,
  },
  starText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 4,
  },
  comment: {
    fontSize: 14,
    color: "#333",
    marginTop: 5,
  },
});

export default Review;