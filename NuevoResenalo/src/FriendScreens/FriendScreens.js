import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import ProfileHeaderFriend from "../Componentes/Friends/ProfileHeaderFriend/ProfileHeaderFriend";
import ProfileStatsFriend from "../Componentes/Friends/ProfileStatsFriends/ProfileStatsFriend";

// ⬇️ Usa el que realmente tengas: Posts o PostList
import Posts from "../Componentes/Friends/PostList/PostList"; // si tu archivo exporta Posts, ajusta nombre/import

const FriendScreens = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header/info amigo */}
      <View style={styles.section}>
        <ProfileHeaderFriend navigation={navigation} />
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <ProfileStatsFriend />
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <Divider style={styles.dividerLine} />
      </View>

      {/* Posts */}
      <View style={styles.postsSection}>
        <Posts navigation={navigation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 16,
  },
  postsSection: {
    paddingHorizontal: 16,
  },
  divider: {
    alignItems: "center",
  },
  dividerLine: {
    marginVertical: 16,
    width: "80%",
  },
});

export default FriendScreens;