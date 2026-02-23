import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getData } from "../services/Services";
import { Searchbar } from "react-native-paper";
import Context from "../Context/Context";

const FindUser = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [shownUsers, setShownUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { emailLogged, setSelectedFriend } = useContext(Context);
  const myEmail = emailLogged?.results?.email;

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const handleClearSearch = () => {
    setSearchText("");
    setShownUsers(users);
  };

  const getImageUri = (rawPhoto) => {
    if (rawPhoto) {
      if (rawPhoto.startsWith("data:image") || rawPhoto.startsWith("http")) {
        return rawPhoto;
      } else {
        return `data:image/jpeg;base64,${rawPhoto}`;
      }
    }
    return null;
  };

  const obtainUsers = async (pageToLoad) => {
    try {
      if (pageToLoad === 0) setLoading(true);
      else setLoadingMore(true);

      const url = `http://44.213.235.160:8080/resenalo/users?page=${pageToLoad}`;
      const response = await getData(url);
      if (response?.totalPages !== undefined) {
        setTotalPages(response.totalPages);
      }

      if (response?.users?.length > 0) {
        const userDetailsPromises = response.users.map(async (link) => {
          const res = await getData(link);
          const r = res?.results;
          if (!r) return null;

          if (r.email === myEmail) return null;

          let photoUrl = await getImageUri(r.photo);

          return {
            id: r.id,
            name: r.name,
            photo: r.photo,
            description: r.description,
            user: r.user,
            reviews: r.reviews,
            followers: r.followers,
          };
        });

        const userDetails = await Promise.all(userDetailsPromises);
        const cleanUsers = userDetails.filter((u) => u !== null);

        const updatedUsers =
          pageToLoad === 0 ? cleanUsers : [...users, ...cleanUsers];

        setUsers(updatedUsers);
        setShownUsers(updatedUsers);
        setPage(pageToLoad);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (page + 1 < totalPages) {
      obtainUsers(page + 1);
    }
  };

  const handleSearch = async () => {
    const q = searchText.trim();
    if (!q) {
      setShownUsers(users);
      return;
    }

    setLoading(true);
    try {
      const url = `http://44.213.235.160:8080/resenalo/searchUsers?user=${q}`;
      const res = await getData(url);

      const results = res?.results || [];
      const mapped = await Promise.all(
        results.map(async (u) => ({
          id: u.id,
          name: u.name,
          photo: u.photo,
          description: u.description,
          user: u.user,
          reviews: u.reviews,
          followers: u.followers,
        }))
      );

      setShownUsers(mapped);
    } catch (e) {
      setShownUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtainUsers(0);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Usuarios</Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar usuario..."
          value={searchText}
          onChangeText={setSearchText}
          onIconPress={handleSearch}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          style={styles.searchBarPaper}
          inputStyle={styles.searchInput}
          clearIcon="close"
          onClearIconPress={handleClearSearch}
        />
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2654d1"
            style={styles.loader}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {shownUsers.length > 0 ? (
              shownUsers.map((item, index) => (
                <Pressable
                  key={`${item.user}-${index}`}
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
                  <View style={styles.card}>
                    <Image source={{ uri: item.photo }} style={styles.image} />
                    <View style={styles.textContainer}>
                      <Text style={styles.placeName}>{item.name}</Text>
                      <Text style={styles.followingText}>@{item.user}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text style={{ textAlign: "center" }}>
                No se encontraron usuarios.
              </Text>
            )}

            {!searchText && page + 1 < totalPages && (
              <View style={styles.footerContainer}>
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#2654d1" />
                ) : (
                  <TouchableOpacity
                    style={styles.loadMoreBtn}
                    onPress={handleLoadMore}
                  >
                    <Text style={styles.loadMoreText}>Cargar más</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchContainer: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 20,
  },
  searchBarPaper: {
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    fontSize: 16,
    minHeight: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "90%",
    alignSelf: "center",
    marginBottom: 15,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  followingText: {
    fontSize: 16,
    color: "#777",
  },
  loader: { marginTop: 20 },
  scrollView: { paddingBottom: 20 },

  footerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadMoreBtn: {
    padding: 12,
    backgroundColor: "#1748ce",
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FindUser;
