import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../Context/Context";

const ProfileHeaderFriend = ({ navigation }) => {
  const { selectedFriend } = useContext(Context);

  if (!selectedFriend) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No hay amigo seleccionado</Text>
      </View>
    );
  }

  const { user, description, name, photo } = selectedFriend;

  return (
    <View style={styles.container}>
      {/* ✅ Flecha atrás */}
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={30} color="#000" />
      </Pressable>

      {/* ✅ Imagen estilo ProfileImage */}
      <View style={styles.photoWrap}>
        <View style={styles.photoSquare}>
          <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
        </View>
      </View>

      {/* ✅ Texto estilo OwnInfo */}
      <View style={{ alignItems: "center" }}>
        <Text style={styles.username}>@{user}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.bio}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Igual que OwnInfo container
  container: {
    marginBottom: 16,
    marginTop: 40,
  },

  // Flecha fija arriba izq
  backButton: {
    position: "absolute",
    top: -10,
    left: 16,
    zIndex: 999,
    padding: 6,
  },

  // Igual que ProfileImage styles
  photoWrap: {
    marginTop: 35,
    alignItems: "center",
  },
  photoSquare: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },

  // Igual que OwnInfo
  username: {
    color: "gray",
    marginTop: 3,
  },
  name: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: "bold",
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 40,
  },
});

export default ProfileHeaderFriend;