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
import Context from "../Context/Context";
import { getData } from "../services/Services";
import { Searchbar } from "react-native-paper";
import { useTranslation } from "react-i18next";

/**
 * Friends Component: Displays a searchable list of users followed by the current user.
 * Features include real-time filtering and dynamic theming for light/dark modes.
 */
const Friends = ({ navigation }) => {
  const { setSelectedFriend, emailLogged, theme, isDark } = useContext(Context);
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFriend, setSearchFriend] = useState("");
  const { t } = useTranslation();

  // Initial data fetch
  useEffect(() => {
    obtainUsers();
  }, []);

  // Client-side filtering logic
  useEffect(() => {
    const result = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(searchFriend.toLowerCase()) ||
        friend.user.toLowerCase().includes(searchFriend.toLowerCase()),
    );
    setFilteredFriends(result);
  }, [searchFriend, friends]);

  /**
   * Fetches friend details from the provided URLs in the user profile.
   * Uses Promise.allSettled to ensure the list renders even if one request fails.
   */
  const obtainUsers = async () => {
    setLoading(true);
    try {
      const friendUrls = emailLogged?.results?.friends ?? [];
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
          };
        }),
      );

      // Filter only successful requests and non-null values
      const successfulFriends = settled
        .filter((x) => x.status === "fulfilled")
        .map((x) => x.value)
        .filter(Boolean);

      setFriends(successfulFriends);
      setFilteredFriends(successfulFriends);
    } catch (err) {
      console.error("Critical error in obtainUsers:", err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary || "#4F46E5"} />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      {/* Header with Dynamic Border */}
      <View
        style={[
          styles.headerContainer,
          {
            backgroundColor: theme.background,
            borderBottomColor: isDark ? "#333" : "#F3F4F6",
          },
        ]}
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color={theme.text}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("friends.list")}
        </Text>
      </View>

      {/* Themed Searchbar */}
      <View
        style={[styles.searchContainer, { backgroundColor: theme.background }]}
      >
        <Searchbar
          placeholder={t("friends.searchHolder")}
          placeholderTextColor={isDark ? "#AAA" : "#6B7280"}
          onChangeText={setSearchFriend}
          value={searchFriend}
          style={[
            styles.searchBar,
            { backgroundColor: isDark ? "#1E1E1E" : "#F3F4F6" },
          ]}
          inputStyle={[styles.searchInput, { color: theme.text }]}
          iconColor={theme.text}
          elevation={1}
        />
      </View>

      {/* List Content */}
      {filteredFriends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.noFriendsText,
              { color: isDark ? "#888" : "#9CA3AF" },
            ]}
          >
            {searchFriend ? t("friends.notFoundFriend") : t("friends.notFound")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.item,
                {
                  backgroundColor: isDark ? "#121212" : "#FFF",
                  borderColor: isDark ? "#333" : "#E5E7EB",
                },
                index !== filteredFriends.length - 1 && styles.itemGap,
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
              <View style={styles.itemRow}>
                <Image
                  source={{ uri: item.photo.trim() }}
                  style={[
                    styles.avatar,
                    { backgroundColor: isDark ? "#333" : "#E5E7EB" },
                  ]}
                  resizeMode="cover"
                />

                <View style={styles.textContainer}>
                  <Text
                    style={[styles.info, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      { color: isDark ? "#AAA" : "#6B7280" },
                    ]}
                    numberOfLines={1}
                  >
                    @{item.user}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={isDark ? "#555" : "#9CA3AF"}
                />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50,
    zIndex: 15,
  },
  headerTitle: { fontSize: 25, fontWeight: "800", textAlign: "center" },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchBar: { borderRadius: 8, height: 45 },
  searchInput: { minHeight: 0, fontSize: 15 },
  listContent: { padding: 16 },
  item: { padding: 14, borderRadius: 12, borderWidth: 1 },
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemGap: { marginBottom: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  textContainer: { flex: 1, marginLeft: 14 },
  info: { fontSize: 16, fontWeight: "bold" },
  username: { fontSize: 13, marginTop: 2, fontWeight: "500" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  noFriendsText: { textAlign: "center", fontSize: 15, fontWeight: "500" },
});

export default Friends;
