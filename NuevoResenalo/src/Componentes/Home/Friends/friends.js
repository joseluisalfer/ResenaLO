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
import { getData } from "../../../services/services";

const pickRandomUpToN = (arr, n = 5) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
};

const Friends = ({ navigation }) => {
  const { setSelectedFriend, emailLogged } = useContext(Context);
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
      console.log(emailLogged.results.friends)
      const settled = await Promise.allSettled(
        friendUrls.map(async (url) => {
          const userData = await getData(url);
          const r = userData?.results;
          return {
            id: r.id,
            name: r.name,
            photo: r.photo,        // 👈 URL tal cual
            description: r.description,
            user: r.user,
            reviews: r.reviews,
          };
        })
      );

      const ok = settled
        .filter((x) => x.status === "fulfilled")
        .map((x) => x.value)
        .filter(Boolean);

      console.log("PHOTO 0 =>", ok[0]?.photo);

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
        <Text style={styles.noFriendsText}>Todavia no tienes amigos</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("AllFriends")}
      >
        <Text style={styles.title}>Amigos</Text>
        <Ionicons name="chevron-forward-outline" size={25} color="#000" />
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
              navigation.navigate("FriendScreens", {
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
              style={styles.avatar}
              resizeMode="cover"
              onError={(e) => {
                console.log("IMAGE ERROR:", item.photo, e.nativeEvent);
              }}
              onLoad={() => {
                console.log("IMAGE LOADED:", item.photo);
              }}
            />

            <Text style={styles.name} numberOfLines={1}>
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
  title: { fontSize: 18, fontWeight: "700", color: "#000" },
  row: { paddingVertical: 4 },
  item: { width: 74, alignItems: "center" },
  itemGap: { marginRight: 12 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 4,
    backgroundColor: "#f0f0f0",
  },
  name: {
    fontSize: 11,
    color: "#000",
    textAlign: "center",
    maxWidth: 74,
    fontWeight: "500",
  },
  noFriendsText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default Friends;