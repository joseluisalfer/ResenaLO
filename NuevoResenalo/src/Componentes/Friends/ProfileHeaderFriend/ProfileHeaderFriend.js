import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";

const ProfileHeaderFriend = ({ navigation }) => {
  const { selectedFriend } = useContext(Context);

  // 🔒 Si no hay amigo seleccionado, mostrar mensaje
  if (!selectedFriend) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No hay amigo seleccionado</Text>
      </View>
    );
  }

  // 🔍 Comprobamos que selectedFriend.results y photo existen
  const getImageUri = () => {
    const photo = selectedFriend.photo;

    if (typeof photo !== "string") return null;

    if (photo.startsWith("http")) return photo;
    if (photo.startsWith("data:image")) return photo;
    if (photo.startsWith("image/")) return `data:${photo}`;
    
    // Asumimos que es base64 puro
    return `image/jpeg;base64,${photo}`;
  };

  const imageUri = getImageUri();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.profileImage}
            resizeMode="cover"
            onError={(e) => console.log("❌ Error cargando imagen:", e.nativeEvent?.error)}
          />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]}>
            <Ionicons name="person" size={50} color="#999" />
          </View>
        )}
      </View>

      <Text style={styles.username}>@{selectedFriend.user}</Text>

      <Text style={styles.fullName}>{selectedFriend.name}</Text>

      <Text style={styles.description} numberOfLines={3}>
        {selectedFriend.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    position: "absolute", // Fija la flecha en la parte superior
    top: 10,
    left: 20, // Coloca la flecha más cerca del borde izquierdo
    zIndex: 1, // Asegura que la flecha esté sobre otros elementos
    padding: 5,
  },
  imageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "#eee",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  username: {
    fontSize: 18,
    color: "#666",
    marginTop: 8,
    fontWeight: "500",
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});

export default ProfileHeaderFriend;
