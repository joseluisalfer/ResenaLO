import React, { useContext, useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, Pressable, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../Context/Context";
import { postData, getData } from "../../services/Services";
import { useTranslation } from "react-i18next";

/**
 * ProfileHeaderFriend Component: Displays the profile information of a friend
 * and manages the follow/unfollow logic.
 */
const ProfileHeaderFriend = ({ navigation }) => {
  const { selectedFriend, emailLogged, theme, isDark } = useContext(Context);
  const { t } = useTranslation();

  const myUserName = emailLogged?.results?.user;
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendDetails, setFriendDetails] = useState(null);

  /**
   * Fetches the follow status and profile details of the selected friend
   */
  const updateFollowStatus = useCallback(async () => {
    if (!selectedFriend?.user || !myUserName) return;

    try {
      const userRes = await getData(
        `http://44.213.235.160:8080/resenalo/user?userName=${myUserName}`,
      );

      if (userRes) {
        const followeds = userRes?.results?.followeds ?? [];
        const friendUrl = `http://44.213.235.160:8080/resenalo/user?userName=${selectedFriend.user}`;
        setIsFollowing(followeds.includes(friendUrl));
      }

      const friendRes = await getData(
        `http://44.213.235.160:8080/resenalo/user?userName=${selectedFriend.user}`,
      );
      if (friendRes) setFriendDetails(friendRes.results);
    } catch (error) {
      // Error handled silently to maintain UI stability
    }
  }, [selectedFriend?.user, myUserName]);

  useFocusEffect(
    useCallback(() => {
      updateFollowStatus();
    }, [updateFollowStatus]),
  );

  /**
   * Handles the logic for adding or removing a follow relationship
   */
  const handleFollowAction = async () => {
    if (!myUserName) {
      Alert.alert("Error", "Your user profile has not loaded yet.");
      return;
    }

    const url = isFollowing
      ? "http://44.213.235.160:8080/resenalo/deleteFollow"
      : "http://44.213.235.160:8080/resenalo/addFollow";

    const body = {
      user: myUserName,
      userFollow: selectedFriend.user,
    };

    try {
      await postData(url, body);
      await updateFollowStatus();
    } catch (error) {
      Alert.alert("Error", "Could not update follow status");
    }
  };

  if (!selectedFriend) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: isDark ? "#888" : "#666" }]}>
          No friend selected
        </Text>
      </View>
    );
  }

  const followColor = isFollowing
    ? isDark
      ? "#ff5c5c"
      : "red"
    : isDark
      ? "#4da3ff"
      : "#2654d1";

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={30} color={theme.text} />
      </Pressable>

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
          {isFollowing
            ? t("profileFriend.buttonUnfollow")
            : t("profileFriend.buttonFollow")}
        </Text>
      </Pressable>

      <View style={styles.photoWrap}>
        <View
          style={[
            styles.photoSquare,
            {
              backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
              borderColor: isDark ? "#444" : "#ccc",
            },
          ]}
        >
          <Image
            source={{ uri: friendDetails?.photo || selectedFriend.photo }}
            style={styles.photo}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={[styles.username, { color: isDark ? "#aaa" : "gray" }]}>
          @{selectedFriend.user}
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text style={[styles.name, { color: theme.text }]}>
          {friendDetails?.name || selectedFriend.name}
        </Text>
        <Text style={[styles.bio, { color: isDark ? "#bbb" : "#333" }]}>
          {friendDetails?.description || selectedFriend.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, marginTop: 40 },
  backButton: {
    position: "absolute",
    top: -10,
    left: 16,
    zIndex: 999,
    padding: 6,
  },
  actionButton: {
    position: "absolute",
    top: -10,
    right: 12,
    zIndex: 999,
    padding: 6,
    alignItems: "center",
    width: 85,
  },
  actionText: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: -2,
    textAlign: "center",
  },
  photoWrap: { marginTop: 35, alignItems: "center" },
  photoSquare: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: { width: "100%", height: "100%", borderRadius: 60 },
  username: { marginTop: 3 },
  name: { marginTop: 5, fontSize: 25, fontWeight: "bold" },
  bio: { textAlign: "center", marginTop: 8, paddingHorizontal: 20 },
  emptyText: { fontSize: 16, textAlign: "center", marginTop: 40 },
});

export default ProfileHeaderFriend;
