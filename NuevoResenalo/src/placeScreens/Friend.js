import React, { useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import ProfileHeaderFriend from "../Componentes/Friends/ProfileHeaderFriend";
import ProfileStatsFriend from "../Componentes/Friends/ProfileStatsFriend";
import PostList from "../Componentes/Friends/PostList";
import Context from "../Context/Context";

/**
 * Friend Screen: Displays the public profile of another user.
 * Structure: Header (Avatar/Info) -> Stats (Followers/Reviews) -> Post Feed.
 */
const Friend = () => {
  const navigation = useNavigation();

  // Extract theme tokens from global context
  const { theme, isDark } = useContext(Context);

  /**
   * ListHeader: Encapsulates all profile info above the post feed.
   * Using this inside FlatList ensures the header scrolls away with the content.
   */
  const ListHeader = () => (
    <View style={{ backgroundColor: theme.background }}>
      {/* Friend identity header (Photo, Name, Bio) */}
      <View style={styles.section}>
        <ProfileHeaderFriend navigation={navigation} />
      </View>

      {/* Numerical statistics (Reviews count, following, etc.) */}
      <View style={styles.section}>
        <ProfileStatsFriend />
      </View>

      {/* Themed Divider for visual separation */}
      <View style={styles.divider}>
        <Divider
          style={[
            styles.dividerLine,
            { backgroundColor: isDark ? "#333" : "#ddd" },
          ]}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: "posts" }]}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={<ListHeader />}
      renderItem={() => (
        <View
          style={[styles.postsSection, { backgroundColor: theme.background }]}
        >
          <PostList navigation={navigation} />
        </View>
      )}
      // Apply background color to both the scrollable area and the container
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingTop: 20,
    flexGrow: 1, // Ensures background covers the screen even if list is short
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
    height: 1,
  },
});

export default Friend;
