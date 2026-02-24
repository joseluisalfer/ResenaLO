import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Context from "../../Context/Context";
import { useFocusEffect } from "@react-navigation/native";
import { getData } from "../../services/Services";
import { useTranslation } from "react-i18next";

/**
 * ProfileStatsFriend Component: Displays numerical statistics (posts and followers)
 * for the currently selected friend profile.
 */
const ProfileStatsFriend = () => {
  const { selectedFriend } = useContext(Context);
  const [stats, setStats] = useState({ reviews: [], followers: [] });
  const { t } = useTranslation();

  /**
   * Fetches the latest stats from the server for the selected friend
   */
  const fetchStats = useCallback(async () => {
    if (selectedFriend?.user) {
      try {
        const data = await getData(
          `http://44.213.235.160:8080/resenalo/user?userName=${selectedFriend.user}`,
        );
        if (data && data.results) {
          setStats({
            reviews: data?.results?.reviews ?? [],
            followers: data?.results?.followers ?? [],
          });
        }
      } catch (error) {
        // Error handled silently to prevent UI disruption
      }
    }
  }, [selectedFriend]);

  // Refresh stats whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
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
          {/* Display total number of reviews/posts */}
          <View style={styles.statItem}>
            <Text variant="titleMedium">{stats.reviews.length}</Text>
            <Text variant="bodySmall">{t("profile.post")}</Text>
          </View>

          {/* Display total number of followers */}
          <View style={styles.statItem}>
            <Text variant="titleMedium">{stats.followers.length}</Text>
            <Text variant="bodySmall">{t("profile.followers")}</Text>
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
