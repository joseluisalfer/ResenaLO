import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import ProfileHeaderFriend from "../Componentes/Friends/ProfileHeaderFriend";
import ProfileStatsFriend from "../Componentes/Friends/ProfileStatsFriend";
import Posts from "../Componentes/Friends/PostList";

const Friend = () => {
  const navigation = useNavigation();

  // ✅ Todo el contenido “de arriba” va en el header del FlatList
  const ListHeader = () => (
    <View>
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
    </View>
  );

  return (
    <FlatList
      data={[{ key: "posts" }]} // FlatList necesita data; renderizamos 1 item que contiene Posts
      keyExtractor={(item) => item.key}
      ListHeaderComponent={<ListHeader />}
      renderItem={() => (
        <View style={styles.postsSection}>
          <Posts navigation={navigation} />
        </View>
      )}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
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

export default Friend;