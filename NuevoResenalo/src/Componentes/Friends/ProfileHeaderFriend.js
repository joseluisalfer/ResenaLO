import React, { useContext, useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import Context from "../../Context/Context";
import { postData, getData } from "../../services/Services";

const ProfileHeaderFriend = ({ navigation }) => {
  const { selectedFriend, emailLogged, setEmailLogged, theme, isDark } = useContext(Context);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendDetails, setFriendDetails] = useState(null);

  const updateFollowStatus = useCallback(async () => {
    if (!selectedFriend || !emailLogged) return;

    try {
      const userRes = await getData(`http://44.213.235.160:8080/resenalo/user?userName=${emailLogged.results.user}`);
      if (userRes) {
        setEmailLogged(userRes);
        const friendUrl = `http://44.213.235.160:8080/resenalo/user?userName=${selectedFriend.user}`;
        setIsFollowing(userRes.results.followeds.includes(friendUrl));
      }

      const friendRes = await getData(`http://44.213.235.160:8080/resenalo/user?userName=${selectedFriend.user}`);
      if (friendRes) {
        setFriendDetails(friendRes.results);
      }
    } catch (error) {
      console.error(error);
    }
  }, [selectedFriend, emailLogged]);

  useFocusEffect(
    useCallback(() => {
      updateFollowStatus();
    }, [updateFollowStatus])
  );

  if (!selectedFriend) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: isDark ? "#888" : "#666" }]}>No hay amigo seleccionado</Text>
      </View>
    );
  }

  const handleFollowAction = async () => {
    const url = isFollowing 
      ? "http://44.213.235.160:8080/resenalo/deleteFollow"
      : "http://44.213.235.160:8080/resenalo/addFollow";

    const body = {
      user: emailLogged.results.user,
      userFollow: selectedFriend.user
    };

    try {
      await postData(url, body);
      await updateFollowStatus();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el seguimiento");
    }
  };

  // Colores dinámicos para el botón de Seguir/Dejar de seguir
  const followColor = isFollowing ? (isDark ? "#ff5c5c" : "red") : (isDark ? "#4da3ff" : "#2654d1");

  return (
    <View style={styles.container}>
      {/* Botón Volver */}
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={30} color={theme.text} />
      </Pressable>

      {/* Botón de Seguimiento */}
      <Pressable
        style={styles.actionButton}
        onPress={handleFollowAction}
        hitSlop={12}
      >
        <Ionicons 
          name={isFollowing ? "close-outline" : "checkmark-outline"} 
          size={28} 
          color={followColor} 
        />
        <Text style={[styles.actionText, { color: followColor }]}>
          {isFollowing ? "Dejar de seguir" : "Seguir"}
        </Text>
      </Pressable>

      {/* Foto de Perfil */}
      <View style={styles.photoWrap}>
        <View style={[
          styles.photoSquare, 
          { 
            backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
            borderColor: isDark ? "#444" : "#ccc"
          }
        ]}>
          <Image 
            source={{ uri: friendDetails?.photo || selectedFriend.photo }} 
            style={styles.photo} 
            resizeMode="cover" 
          />
        </View>
      </View>

      {/* Info de Usuario */}
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.username, { color: isDark ? "#aaa" : "gray" }]}>@{selectedFriend.user}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={[styles.name, { color: theme.text }]}>{friendDetails?.name || selectedFriend.name}</Text>
        <Text style={[styles.bio, { color: isDark ? "#bbb" : "#333" }]}>
          {friendDetails?.description || selectedFriend.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, marginTop: 40 },
  backButton: { position: "absolute", top: -10, left: 16, zIndex: 999, padding: 6 },
  actionButton: { position: "absolute", top: -10, right: 12, zIndex: 999, padding: 6, alignItems: "center", width: 85 },
  actionText: { fontSize: 10, fontWeight: "bold", marginTop: -2, textAlign: "center" },
  photoWrap: { marginTop: 35, alignItems: "center" },
  photoSquare: { width: 120, height: 120, borderRadius: 60, borderWidth: 1, justifyContent: "center", alignItems: "center" },
  photo: { width: "100%", height: "100%", borderRadius: 60 },
  username: { marginTop: 3 },
  name: { marginTop: 5, fontSize: 25, fontWeight: "bold" },
  bio: { textAlign: "center", marginTop: 8, paddingHorizontal: 20 },
  emptyText: { fontSize: 16, textAlign: "center", marginTop: 40 }
});

export default ProfileHeaderFriend;