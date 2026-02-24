import React, { useContext } from "react"; // Importamos useContext
import { View, Text, StyleSheet } from "react-native"; 
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context"; // Ajusta la ruta según tu carpeta

const Review = ({ name, comment, stars }) => {
  // Extraemos theme e isDark del contexto
  const { theme, isDark } = useContext(Context);

  return (
    <View style={styles.container}>
      <View style={[
        styles.commentBox, 
        { 
          backgroundColor: isDark ? "#1e1e1e" : "#f9f9f9", // Gris muy oscuro en dark mode
          borderColor: isDark ? "white" : "#eee" 
        }
      ]}>
        {/* Nombre del usuario */}
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>

        <View style={styles.starsContainer}>
          <Text style={[styles.starText, { color: isDark ? "white" : "#555" }]}>{stars}</Text>
          <Ionicons name="star" size={18} color="#FFD700" /> 
        </View>

        {/* El cuerpo del comentario */}
        <Text style={[styles.comment, { color: isDark ? "white" : "#555" }]}>
          {comment}
        </Text>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  commentBox: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 15,
    right: 15,
  },
  starText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Review;