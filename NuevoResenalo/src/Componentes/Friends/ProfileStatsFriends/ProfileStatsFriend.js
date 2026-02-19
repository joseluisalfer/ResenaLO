import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Context from "../../../Context/Context";

const ProfileStatsFriend = () => {
  const { selectedFriend } = useContext(Context);

  if (!selectedFriend) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const reviews = selectedFriend.reviews || [];
  const followers = selectedFriend.followers || [];

  const reviewCount = reviews.length;
  const followersCount = followers.length;

  return (
    <View>
      <Card style={styles.statsCard}>
        <Card.Content style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{reviewCount}</Text>
            <Text variant="bodySmall">Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{followersCount}</Text>
            <Text variant="bodySmall">Followers</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
});

export default ProfileStatsFriend;