import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importando Ionicons

const Friends = ({ navigation, friends }) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("AllFriends")}
      >
        <Text style={styles.title}>Amigos</Text>
        <Ionicons name="chevron-forward-outline" size={25} color="#000000" />
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
            onPress={() => navigation.navigate("Friend", { friendId: item.id })}
          >
            <Image
              source={require("../../../../assets/images/Konoha.png")}
              style={styles.avatar}
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

export default Friends;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingVertical: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  arrow: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginLeft: 6,
  },
  row: {
    paddingTop: 2,
    paddingBottom: 2,
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
  },
  name: {
    fontSize: 11,
    color: "#000",
    textAlign: "center",
    maxWidth: 74,
  },
});
