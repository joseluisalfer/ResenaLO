import React from "react";
import { View, Text, Card, StyleSheet } from "react-native";
import { useTranslation } from 'react-i18next';

const ProfileStats = ({ postsCount, commentsCount, friendsCount }) => {
  const { t } = useTranslation();
  
  return (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="titleMedium">{postsCount}</Text>
          <Text variant="bodySmall">{t("profile.post")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleMedium">{commentsCount}</Text>
          <Text variant="bodySmall">{t("profile.comments")}</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleMedium">{friendsCount}</Text>
          <Text variant="bodySmall">{t("profile.friends")}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 16,
    width: "90%",
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
});

export default ProfileStats;
