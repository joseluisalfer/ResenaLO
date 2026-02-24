import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * Review Component: Renders an individual user comment with a star rating.
 * Automatically adapts its colors based on the application's theme.
 */
const Review = ({ name, comment, stars }) => {
  const { theme, isDark } = useContext(Context);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.commentBox,
          {
            backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9",
            borderColor: isDark ? "white" : "#eee",
          },
        ]}
      >
        {/* User identification */}
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>

        {/* Rating display positioned in the top-right corner */}
        <View style={styles.starsContainer}>
          <Text style={[styles.starText, { color: isDark ? "white" : "#555" }]}>
            {stars}
          </Text>
          <Ionicons name="star" size={18} color="#FFD700" />
        </View>

        {/* Review body text */}
        <Text style={[styles.comment, { color: isDark ? "white" : "#555" }]}>
          {comment}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  commentBox: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
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
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Review;
