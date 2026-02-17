import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput
} from "react-native";
import { getData } from "../services/services";

const FindUser = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState(""); // Estado para la barra de búsqueda

  // Función para manejar la imagen y detectar si es URL o Base64
  const getImageUri = (rawPhoto) => {
    if (rawPhoto) {
      if (rawPhoto.startsWith("data:image")) {
        return rawPhoto; // Si es Base64
      } else if (rawPhoto.startsWith("http")) {
        return rawPhoto; // Si es una URL
      } else {
        return `data:image/jpeg;base64,${rawPhoto}`; // Si es Base64 sin prefijo
      }
    }
    return null;
  };

  // Función para convertir una imagen en URI a Base64
  const toBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result); // Devolvemos la imagen en formato Base64
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convierte la imagen a Base64
    });
  };

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
            let photoUrl = res.results.photo;
            photoUrl = await getImageUri(photoUrl); // Aplicamos getImageUri para manejar la imagen

            return {
              name: res.results.name,
              photo: photoUrl, // Asignamos la imagen procesada
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

  // Filtrar usuarios según el texto de búsqueda
  const filteredUsers = users.filter((user) =>
    user.user.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    obtainUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Usuarios</Text>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar usuario..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={{ width: "100%" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#2654d1" style={styles.loader} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => {
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
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  searchContainer: {
    width: "90%",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
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
