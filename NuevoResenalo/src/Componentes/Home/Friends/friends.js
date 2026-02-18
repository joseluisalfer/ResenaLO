import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";
import { getData } from "../../../services/services";

const Friends = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setSelectedFriend } = useContext(Context);

  useEffect(() => {
    obtainUsers();
  }, []);

 const obtainUsers = async () => {
  try {
    const data = await getData("http://44.213.235.160:8080/resenalo/users");
    const userUrls = data?.users || [];

    if (!Array.isArray(userUrls) || userUrls.length === 0) {
      setFriends([]);
      return;
    }

    const userDetails = await Promise.all(
      userUrls.map(async (url) => {
        try {
          const userData = await getData(url);
          
          const userName = userData?.results?.name || userData?.user?.name || "Usuario";
          const userPhoto = userData?.results?.photo || userData?.user?.photo || null;
          const userDescription = userData?.results?.description || userData?.user?.description || "Sin descripción";
          const userUser = userData?.results?.user || userData?.user?.user || "nombre";

          let imageUri = null;
          if (userPhoto && typeof userPhoto === "string") {
            if (userPhoto.startsWith("http")) {
              imageUri = userPhoto;
            } else if (userPhoto.startsWith("data:image")) {
              imageUri = userPhoto;
            } else if (userPhoto.startsWith("image")) {
              imageUri = `data:${userPhoto}`;
            } else {
              imageUri = `data:image/jpeg;base64,${userPhoto}`;
            }
          }

          return { name: userName, photo: imageUri, description: userDescription, user: userUser };
        } catch (err) {
          return { name: "Error", photo: null, description: "Sin descripción", user: null };
        }
      })
    );

    const friendsList = userDetails.map((user, index) => ({
      id: `friend_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: user.name,
      photo: user.photo,
      description: user.description,
      user: user.user,
    }));

    setFriends(friendsList);

  } catch (err) {
    console.error(" Error crítico en obtainUsers:", err);
    setError("No se pudieron cargar los amigos. Verifica tu conexión.");
  } finally {
    setLoading(false);
  }
};

  // 🔄 Estado de carga
  if (loading) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}></Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.errorText}> {error}</Text>
        <Pressable style={styles.retryButton} onPress={obtainUsers}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {/* Header con navegación */}
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("AllFriends")}
      >
        <Text style={styles.title}>Friends</Text>
        <Ionicons name="chevron-forward-outline" size={25} color="#000" />
      </Pressable>

      <FlatList
        horizontal
        data={friends}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item, index }) => (
          <Pressable
            style={[styles.item, index !== friends.length - 1 && styles.itemGap]}
            onPress={() => {
              setSelectedFriend(item);

              // ✅ Pasar `user` al navegar a la pantalla del amigo
              navigation.navigate("FriendScreens", {
                friendId: item.id,
                friendName: item.name,
                friendPhoto: item.photo,
                friendDescription: item.description,
                friendUser: item.user, // Aquí se pasa el campo `user`
              });
            }}
          >
            {/* 🖼️ Avatar con fallback */}
            {item.photo ? (
              <Image
                source={{ uri: item.photo }}
                style={styles.avatar}
                resizeMode="cover"
                onError={(e) => console.log("❌ Error cargando imagen:", e.nativeEvent?.error)}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={28} color="#888" />
              </View>
            )}

            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay amigos para mostrar</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
    fontSize: 14,
  },
  errorText: {
    color: "#DC3545",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  row: {
    paddingVertical: 4,
  },
  item: {
    width: 74,
    alignItems: "center",
  },
  itemGap: {
    marginRight: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 4,
    backgroundColor: "#f0f0f0",
  },
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: {
    fontSize: 11,
    color: "#000",
    textAlign: "center",
    maxWidth: 74,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontStyle: "italic",
    fontSize: 13,
  },
});

export default Friends;
