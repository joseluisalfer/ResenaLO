import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";
import { getData } from "../../../services/Services";

const pickRandomUpToN = (arr, n = 5) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
};

const Friends = ({ navigation }) => {
  // 1. Extraemos theme e isDark del Contexto
  const { setSelectedFriend, emailLogged, theme, isDark } = useContext(Context);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtainUsers();
  }, []);

  const obtainUsers = async () => {
    setLoading(true);
    try {
      const rawFriends = emailLogged?.results?.friends ?? [];
      const friendUrls = pickRandomUpToN(rawFriends, 5);
      
      const settled = await Promise.allSettled(
        friendUrls.map(async (url) => {
          const userData = await getData(url);
          const r = userData?.results;
          return {
            id: r.id,
            name: r.name,
            photo: r.photo,
            description: r.description,
            user: r.user,
            reviews: r.reviews,
            followers: r.followers
          };
        })
      );

      const ok = settled
        .filter((x) => x.status === "fulfilled")
        .map((x) => x.value)
        .filter(Boolean);

      setFriends(ok);
    } catch (err) {
      console.error("Error crítico en obtainUsers:", err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color="#2654d1" />
      </View>
    );
  }

  if (friends.length === 0) {
    return (
      <View style={styles.wrapper}>
        {/* Color de texto dinámico para "Todavía no tienes amigos" */}
        <Text style={[styles.noFriendsText, { color: isDark ? '#aaa' : '#666' }]}>
          Todavia no tienes amigos
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("AllFriends")}
      >
        {/* 2. Aplicamos color dinámico al título y al icono */}
        <Text style={[styles.title, { color: theme.text }]}>Amigos</Text>
        <Ionicons 
          name="chevron-forward-outline" 
          size={25} 
          color={theme.text} // El chevron ahora cambia según el tema
        />
      </Pressable>

      <FlatList
        horizontal
        data={friends}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        renderItem={({ item, index }) => (
          <Pressable
            style={[
              styles.item,
              index !== friends.length - 1 && styles.itemGap,
            ]}
            onPress={() => {
              setSelectedFriend(item);
              navigation.navigate("Friend", {
                friendId: item.id,
                friendName: item.name,
                friendPhoto: item.photo,
                friendDescription: item.description,
                friendUser: item.user,
                friendReviews: item.reviews,
              });
            }}
          >
            <Image
              source={{ uri: item.photo.trim(), cache: "reload" }}
              style={[
                styles.avatar, 
                { backgroundColor: isDark ? "#333" : "#f0f0f0" } // Fondo de imagen dinámico
              ]}
              resizeMode="cover"
            />

            {/* 3. Nombre del amigo en color dinámico */}
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingHorizontal: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  title: { fontSize: 18, fontWeight: "700" },
  row: { paddingVertical: 4 },
  item: { width: 74, alignItems: "center" },
  itemGap: { marginRight: 12 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 4,
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    maxWidth: 74,
    fontWeight: "500",
  },
  noFriendsText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default Friends;