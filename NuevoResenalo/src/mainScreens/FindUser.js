import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { getData } from "../services/services";

const FindUser = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // const imageUri = photo
  //   ? photo.startsWith("data:image")
  //     ? photo
  //     : photo.startsWith("http")
  //       ? photo : `data:image/jpeg;base64,${photo}`
  //   : null;

  const obtainUsers = async () => {
    try {
      setLoading(true);
      const urlUsers = await getData("http://44.213.235.160:8080/resenalo/users");

      console.log("Respuesta de la API de usuarios:", urlUsers);

      if (urlUsers && urlUsers.users && urlUsers.users.length > 0) {
        const userDetailsPromises = urlUsers.users.map(async (link) => {
          const res = await getData(link);
          console.log("Detalles completos del usuario:", res);

          if (res.results) {
            const photoUrl = res.results.photo;
            return {
              name: res.results.name,
              photo: photoUrl,
              user: res.results.user,
            };
          } else {
            console.log("No se encontraron resultados en el enlace:", link);
            return null;
          }
        });

        const userDetails = await Promise.all(userDetailsPromises);

        setUsers(userDetails.filter((user) => user !== null));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtainUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Usuarios</Text>
      </View>
      <View style={{ width: "100%" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#2654d1" style={styles.loader} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {users.length > 0 ? (
              users.map((item, index) => {
                console.log("Rendering user:", item);
                return (
                  <Pressable
                    key={index}
                    onPress={() => navigation.navigate("Friend", { friendId: item.user })}
                  >
                    <View style={styles.card}>
                      <Image source={{ uri: item.photo }} style={styles.image} />
                      <View style={styles.textContainer}>
                        <Text style={styles.placeName}>{item.name}</Text>
                        <Text style={styles.followingText}>@{item.user}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <Text>No se encontraron usuarios.</Text>
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
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  header: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "90%",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
    marginBottom: 15,
    alignSelf: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  followingText: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
    textAlign: "left",
  },
  loader: {
    marginTop: 20,
  },
  scrollView: {
    width: "100%",
    paddingBottom: 20,
  },
});

export default FindUser;
