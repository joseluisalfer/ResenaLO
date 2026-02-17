import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context"; // Importamos el contexto
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileHeaderFriend = ({ navigation }) => {
  const { selectedFriend } = useContext(Context); // Usamos el contexto para obtener el amigo seleccionado
  const [loading, setLoading] = useState(false); // Estado para controlar si los datos están cargando
  const [isFollowing, setIsFollowing] = useState(false); // Estado para controlar si el usuario sigue o no al amigo


  // Función para obtener el estado de seguimiento desde AsyncStorage
  const getFollowStatus = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(`followStatus_${selectedFriend.user}`);
      if (storedStatus !== null) {
        setIsFollowing(JSON.parse(storedStatus)); // Establecemos el estado si ya estaba guardado
      }
    } catch (error) {
      console.error("Error getting follow status", error);
    }
  };

  // Función para guardar el estado de seguimiento en AsyncStorage
  const saveFollowStatus = async (status) => {
    try {
      await AsyncStorage.setItem(`followStatus_${selectedFriend.user}`, JSON.stringify(status)); // Guardamos el estado
    } catch (error) {
      console.error("Error saving follow status", error);
    }
  };

  useEffect(() => {
    // Cargar el estado de seguimiento cuando se monta el componente
    getFollowStatus();
  }, [selectedFriend]);

  // Si no hay un amigo seleccionado, se muestra un indicador de carga
  if (!selectedFriend) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const { name, user, description, photo } = selectedFriend;

  // Aseguramos que la foto esté bien formateada (base64 o URL)
  const imageUri = photo
    ? photo.startsWith("data:image")
      ? photo
      : photo.startsWith("http")
      ? photo
      : `data:image/jpeg;base64,${photo}`
    : null;

  const handleFollow = () => {
    const newFollowStatus = !isFollowing;
    setIsFollowing(newFollowStatus); // Cambiar el estado de seguir a no seguir o viceversa
    saveFollowStatus(newFollowStatus); // Guardar el nuevo estado en AsyncStorage
  };

  return (
    <View style={styles.container}>
      {/* Flecha de regreso siempre visible */}
      <Ionicons
        name="arrow-back"
        size={30}
        color="black"
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")} // Navega directamente a la pantalla Home
      />

      {/* Botón de Seguir ubicado arriba a la derecha */}
      <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
        <Ionicons
          name={isFollowing ? "close-circle" : "checkmark-circle"} // Cambia el ícono basado en el estado
          size={30}
          color={isFollowing ? "red" : "green"} // Cambia el color según si está siguiendo o no
        />
        <Text style={styles.followText}>{isFollowing ? "Siguiendo" : "Seguir"}</Text>
      </TouchableOpacity>

      <View style={styles.profileImageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]} />
        )}
      </View>

      <Text style={styles.username}>@{name}</Text>
      <Text style={styles.name}>{user}</Text>

      {/* Mostrar la descripción solo si existe */}
      {description ? (
        <Text style={styles.bio}>{description}</Text>
      ) : (
        <Text style={styles.bio}>No description available</Text> // Mensaje por defecto si no hay descripción
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 40,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 10,
    right: 280,
  },
  followButton: {
    position: "absolute",
    top: 10,
    left: 190,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  followText: {
    marginLeft: 8,
    fontSize: 18,
    color: "#333",
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },
  placeholder: {
    backgroundColor: "#ddd", // Esto será usado si no hay imagen
  },
  name: {
    marginTop: 12,
    fontWeight: "bold",
    fontSize: 20,
  },
  username: {
    color: "gray",
    marginTop: 3,
    fontSize: 20,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
    fontSize: 20,
  },
});

export default ProfileHeaderFriend;
