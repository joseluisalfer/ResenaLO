import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";

/**
 * PlaceInfo Component: Displays the header information for a specific place,
 * including name, category, description, and average rating.
 */
const PlaceInfo = ({ name, description, type, averageRating }) => {
  const { theme, isDark } = useContext(Context);

  // Ensures the rating is always displayed with one decimal place
  const formattedRating =
    typeof averageRating === "number"
      ? averageRating.toFixed(1)
      : averageRating;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Place Name with theme-based color */}
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>

        {/* Rating chip with adaptive background for light/dark modes */}
        <View
          style={[
            styles.ratingContainer,
            { backgroundColor: isDark ? "#333" : "#f0f0f0" },
          ]}
        >
          <Text style={[styles.rating, { color: theme.text }]}>
            {formattedRating}
          </Text>
          <Ionicons
            name="star"
            size={16}
            color={isDark ? "#FFD700" : "#000000"}
          />
        </View>
      </View>

      {/* Category/Type with adjusted blue shade for better contrast */}
      <Text style={[styles.type, { color: isDark ? "#4da3ff" : "#1748ce" }]}>
        {type}
      </Text>

      {/* Description with secondary text colors */}
      <Text style={[styles.description, { color: isDark ? "#bbb" : "#666" }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  type: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    marginTop: 4,
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
  },
});

export default PlaceInfo;
