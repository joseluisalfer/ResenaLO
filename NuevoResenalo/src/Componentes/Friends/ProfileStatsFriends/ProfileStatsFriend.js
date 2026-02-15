import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const ProfileStatsFriend = () => {
  return (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>24</Text>
          <Text variant="bodySmall" style={styles.statText}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>100</Text>
          <Text variant="bodySmall" style={styles.statText}>Comments</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>180</Text>
          <Text variant="bodySmall" style={styles.statText}>Friends</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 16,
    width: "90%",
    backgroundColor: "#2654d1",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statText: {
    color: "white",
    fontSize: 18,
    
  }
});

export default ProfileStatsFriend;
