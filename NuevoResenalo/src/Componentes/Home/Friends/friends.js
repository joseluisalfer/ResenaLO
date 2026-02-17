import React, { useContext } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import Context from "../../../Context/Context"; // Importamos el contexto

const Friends = ({ navigation, friends, setSelectedFriend }) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.header}
        onPress={() => navigation.navigate("AllFriends")}
      >
        <Text style={styles.title}>Friends</Text>
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
            style={[styles.item, index !== friends.length - 1 && styles.itemGap]}
            onPress={() => {
              setSelectedFriend(item); // Guardamos el amigo seleccionado en el contexto
              navigation.navigate("FriendScreens", { friendId: item.id }); // Navegamos a la pantalla del perfil
            }}
          >
            {/* Mostrar la foto del amigo */}
            {item.photo ? (
              <Image
                source={{ uri: item.photo }} // Usamos la foto del amigo desde la API
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar} /> // Si no hay foto, mostramos un placeholder
            )}
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

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

export default Friends;
