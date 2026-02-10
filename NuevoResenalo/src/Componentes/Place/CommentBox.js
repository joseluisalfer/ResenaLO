import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importamos Ionicons para las estrellas

const CommentBox = ({ name, comment, stars }) => {
  return (
    <View style={styles.container}>
      <View style={styles.commentBox}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.starsContainer}>
          <Text style={{ fontSize: 20 }}>{stars}</Text>
          <Ionicons name="star" size={20} color="#000000" />
        </View>

        <Text style={styles.comment}>{comment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  commentBox: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative", // Para posicionar las estrellas en la esquina
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  starsContainer: {
    
    flexDirection: "row", // Asegura que las estrellas estén en una fila
    alignItems: "center", // Alinea las estrellas en el centro
    position: "absolute", // Posicionamos las estrellas en la esquina
    top: '20%',
    right: '10%',
    flexDirection: "row", // Las estrellas estarán en una fila
  },
  comment: {
    fontSize: 14,
    color: "#333",
  },
});

export default CommentBox;
