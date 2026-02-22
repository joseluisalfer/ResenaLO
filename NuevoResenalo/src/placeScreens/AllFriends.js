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
import { Searchbar } from 'react-native-paper';

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
  const [filteredFriends, setFilteredFriends] = useState([]); // Estado para la lista filtrada
  const [loading, setLoading] = useState(true);
  const [searchFriend, setSearchFriend] = useState("");

  useEffect(() => {
    obtainUsers();
  }, []);

  // Efecto para filtrar cuando cambia el texto de búsqueda o la lista original
  useEffect(() => {
    const result = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchFriend.toLowerCase()) ||
      friend.user.toLowerCase().includes(searchFriend.toLowerCase())
    );
    setFilteredFriends(result);
  }, [searchFriend, friends]);

 const obtainUsers = async () => {
    setLoading(true);
    try {
      // 1. Obtenemos todos los URLs sin recortar
      const friendUrls = emailLogged?.results?.friends ?? [];
      
      // 2. Mapeamos sobre todos los URLs (ya no usamos pickRandomUpToN)
      const settled = await Promise.allSettled(
        friendUrls.map(async (url) => {
          const userData = await getData(url);
          const r = userData?.results;
          if (!r) return null; // Validación de seguridad
          
          return {
            id: r.id,
            name: r.name,
            photo: r.photo,
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

      setFriends(ok);
      setFilteredFriends(ok); 
    } catch (err) {
      console.error("Error crítico en obtainUsers:", err);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back"
          size={28}
          color="#1F2937"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Lista de amigos</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por nombre..."
          onChangeText={setSearchFriend}
          value={searchFriend}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
         
          elevation={1} 
        />
      </View>

      {filteredFriends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.noFriendsText}>
            {searchFriend ? "No se encontraron resultados" : "Todavía no tienes amigos"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFriends} // Usamos la lista filtrada aquí
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.item,
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
                  style={styles.avatar}
                  resizeMode="cover"
                />

                <View style={styles.textContainer}>
                  <Text style={styles.info} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.username} numberOfLines={1}>
                    @{item.user}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContainer: {
    backgroundColor: "#FFF",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    position: "absolute", 
    left: 16,
    top: 50,              
    zIndex: 15,           
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
  },
  searchBar: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8, // Menos redondeado para que sea rectangular
    height: 45,
  },
  searchInput: {
    minHeight: 0, // Corrige alineación vertical en Android
    fontSize: 15,
  },
  listContent: {
    padding: 16,
  },
  item: {
    backgroundColor: "#f0f0f0", // Cambiado a blanco para mejor contraste
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemGap: {
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  info: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  username: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFriendsText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 15,
    fontWeight: "500"
  },
});

export default Friends;