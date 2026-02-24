import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";
import { getData } from "../../../services/Services";
import { useTranslation } from "react-i18next";

/**
 * Utility to shuffle an array and return the first N elements
 */
const pickRandomUpToN = (arr, n = 5) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
};

/**
 * Friends Component: Displays a horizontal list of 5 random friends
 */
const Friends = ({ navigation }) => {
  const { setSelectedFriend, emailLogged, theme, isDark } = useContext(Context);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  /**
   * Fetches data for random friends from the user's friend list
   */
  const obtainUsers = useCallback(async () => {
    setLoading(true);
    try {
      const rawFriends = emailLogged?.results?.friends ?? [];
      const friendUrls = pickRandomUpToN(rawFriends, 5);

      const settled = await Promise.allSettled(
        friendUrls.map(async (url) => {
          const userData = await getData(url);
          const r = userData?.results;
          if (!r) return null;
          return {
            id: r.id,
            name: r.name,
            photo: r.photo,
            description: r.description,
            user: r.user,
            reviews: r.reviews,
            followers: r.followers,
          };
        }),
      );

      const ok = settled
        .filter((x) => x.status === "fulfilled")
        .map((x) => x.value)
        .filter(Boolean);

      setFriends(ok);
    } catch (err) {
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, [emailLogged]);

  // Refreshes friend list every time the screen gains focus
  useFocusEffect(
    useCallback(() => {
      obtainUsers();
    }, [obtainUsers]),
  );

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
        <Text
          style={[styles.noFriendsText, { color: isDark ? "#aaa" : "#666" }]}
        >
          {t("friends.notFound")}
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
        <Text style={[styles.title, { color: theme.text }]}>
          {t("friends.friends")}
        </Text>
        <Ionicons name="chevron-forward-outline" size={25} color={theme.text} />
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
              navigation.navigate("Friend");
            }}
          >
            <Image
              source={{ uri: item.photo.trim(), cache: "reload" }}
              style={[
                styles.avatar,
                { backgroundColor: isDark ? "#333" : "#f0f0f0" },
              ]}
              resizeMode="cover"
            />
            <Text
              style={[styles.name, { color: theme.text }]}
              numberOfLines={1}
            >
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
