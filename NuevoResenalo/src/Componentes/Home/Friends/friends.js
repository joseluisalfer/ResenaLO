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
    try {
      setLoading(true);

      const friendUrls = pickRandomUpToN(emailLogged.results.friends, 5);

      const userDetails = await Promise.all(
        friendUrls.map(async (url) => {
          const userData = await getData(url);

          const userName = userData.results.name;
          const userPhoto = userData.results.photo;
          const userDescription = userData.results.description;
          const userUser = userData.results.user;
          const userReviews = userData.results.reviews;

          let imageUri = null;
          if (userPhoto.startsWith("http")) imageUri = userPhoto;
          else if (userPhoto.startsWith("data:image")) imageUri = userPhoto;
          else if (userPhoto.startsWith("image/")) imageUri = `data:${userPhoto}`;
          else imageUri = `data:image/jpeg;base64,${userPhoto}`;

          return {
            id: userData.results.id, // ✅ id estable (no parsear URL)
            name: userName,
            photo: imageUri,
            description: userDescription,
            user: userUser,
            reviews: userReviews,
          };
        })
      );

      setFriends(userDetails);
    } catch (err) {
      console.error("Error crítico en obtainUsers:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator size="large" color="#2654d1" />
        <Text style={styles.loadingText}></Text>
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
            {item.photo ? (
              <Image
                source={{ uri: item.photo }}
                style={styles.avatar}
                resizeMode="cover"
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingHorizontal: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#000" },
  loadingText: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
    fontSize: 14,
  },
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
  noFriendsText: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default Friends;
