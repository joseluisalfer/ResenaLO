import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import Context from "../../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * CardInfo Component: Displays the logged-in user's statistics,
 * specifically the count of posts (reviews) and followers.
 */
const CardInfo = () => {
  const { emailLogged } = useContext(Context);
  const { t } = useTranslation();

  // Safely extract arrays from context to determine counts
  const reviews = emailLogged?.results?.reviews ?? [];
  const followers = emailLogged?.results?.followers ?? [];

  const reviewsCount = reviews.length;
  const followersCount = followers.length;

  return (
    <View>
      <Card style={styles.statsCard}>
        <Card.Content style={styles.statsContainer}>
          {/* Post/Review count display */}
          <View style={styles.statItem}>
            <Text variant="titleMedium">{reviewsCount}</Text>
            <Text variant="bodySmall">{t("profile.post")}</Text>
          </View>

          {/* Followers count display */}
          <View style={styles.statItem}>
            <Text variant="titleMedium">{followersCount}</Text>
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
});

export default CardInfo;
