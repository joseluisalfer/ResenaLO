import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Context from "../../Context/Context";
import { useFocusEffect } from '@react-navigation/native';
import { getData } from "../../services/Services";

const ProfileStatsFriend = () => {
  const { selectedFriend } = useContext(Context);
  const [stats, setStats] = useState({ reviews: [], followers: [] });

  const fetchStats = useCallback(async () => {
    if (selectedFriend?.user) {
      try {
        const data = await getData(`http://44.213.235.160:8080/resenalo/user?userName=${selectedFriend.user}`);
        if (data && data.results) {
          setStats({
            reviews: data.results.reviews || [],
            followers: data.results.followers || []
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }
  }, [selectedFriend]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  if (!selectedFriend) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Card style={styles.statsCard}>
        <Card.Content style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{stats.reviews.length}</Text>
            <Text variant="bodySmall">Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{stats.followers.length}</Text>
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