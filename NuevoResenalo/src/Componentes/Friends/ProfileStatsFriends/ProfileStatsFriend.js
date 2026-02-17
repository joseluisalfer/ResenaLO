import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import Context from "../../../Context/Context"; // Asegúrate de que el contexto esté importado correctamente

const ProfileStatsFriend = () => {
  const { selectedFriend } = useContext(Context); // Obtener los datos del amigo seleccionado desde el contexto
  const [loading, setLoading] = useState(false);

  // Si no hay un amigo seleccionado, muestra un mensaje de carga
  if (!selectedFriend) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Obtenemos las reviews y amigos del contexto
  const reviews = selectedFriend.reviews || [];
  const friends = selectedFriend.friends || [];

  // Obtener la cantidad de reviews y amigos
  const reviewCount = reviews.length;
  const friendCount = friends.length;

  return (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>{reviewCount}</Text>
          <Text variant="bodySmall" style={styles.statText}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="titleMedium" style={styles.statText}>{friendCount}</Text>
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
