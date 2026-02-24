import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Context from "../../../Context/Context";
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
const CardInfo = () => {
  const { emailLogged } = useContext(Context);
  const reviews = emailLogged?.results?.reviews ?? [];
  const followers = emailLogged?.results?.followers ?? [];
  const { t } = useTranslation();

  useEffect(() => {
    console.log(reviews);
  }, [reviews]);

  // Contar la cantidad de reviews
  const reviewsCount = reviews.length;
  const followersCount = followers.length;

  return (
    <View>
      <Card style={styles.statsCard}>
        <Card.Content style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="titleMedium">{reviewsCount}</Text>
            {/* Muestra la cantidad de reviews */}
            <Text variant="bodySmall">{t("profile.post")}</Text>
          </View>
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
