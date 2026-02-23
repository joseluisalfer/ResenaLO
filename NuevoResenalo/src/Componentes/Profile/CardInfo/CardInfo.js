import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Context from "../../../Context/Context";
import { useFocusEffect } from '@react-navigation/native';

const CardInfo = () => {
  const { emailLogged } = useContext(Context);
  const [reviews, setReviews] = useState(emailLogged.results.reviews || []); // Asegúrate de que reviews es un array
  const [followers, setFollowers] = useState(emailLogged.results.followers || []); // Asegúrate de que reviews es un array

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
            <Text variant="bodySmall">{t("profile.")}</Text>
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
});

export default CardInfo;
