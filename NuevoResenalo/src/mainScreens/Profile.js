import React, { useState } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native"; // Asegúrate de que importas useNavigation

import ProfileImage from "../Componentes/Profile/ProfileImage/ProfileImage";

const mockPosts = [
  {
    id: "1",
    title: "Mi primera publicación",
    content: "Mi gran verano en 2024...",
  },
  { id: "2", title: "Un gran día", content: "La perdí con un trabajo..." },
  {
    id: "3",
    title: "React Native 🚀",
    content: "Me encanta desarrollar apps móviles.",
  },
]; 

const Profile = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();  // Usar el hook para navegación

  const renderPost = ({ item }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium" style={{ marginTop: 4 }}>
          {item.content}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          {/* Imagen de perfil */}
          <ProfileImage image={image} setImage={setImage} />

          <View style={{ alignItems: "center" }}>
            <Text variant="bodyMedium" style={styles.username}>
              @samueltrava.official
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text variant="headlineSmall" style={styles.name}>
              Samuel Rodriguez
            </Text>

            <Text variant="bodyMedium" style={styles.ubication}>
              Valencia, España
            </Text>

            <Text variant="bodyMedium" style={styles.bio}>
              Desarrollador móvil | Amante de las mujeres | LOL player
            </Text>
          </View>

          {/* Botón de editar perfil */}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("EditProfile")}  // Asegúrate de que el nombre coincida con el registrado
            style={styles.editButton}
          >
            Editar Perfil
          </Button>

          {/* Estadísticas */}
          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="titleMedium">24</Text>
                <Text variant="bodySmall">Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">1.2K</Text>
                <Text variant="bodySmall">Seguidores</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">180</Text>
                <Text variant="bodySmall">Siguiendo</Text>
              </View>
            </Card.Content>
          </Card>

          <Divider style={{ marginVertical: 16 }} />

          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            Publicaciones
          </Text>
        </View>
      }
      data={mockPosts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 40,
  },
  topContainer: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    flexDirection: "row",
    borderRadius: 10,
  },
  menuIcon: {
    position: "absolute",
    left: 10,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileHeader: {
    marginTop: 35,
    alignItems: "center",
  },
  profilePicContainer: {
    position: "relative",
  },
  avatar: {
    backgroundColor: "#f0f0f0",
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    borderRadius: 20,
    padding: 5,
  },
  addButton: {
    color: "white",
    fontSize: 18,
  },
  name: {
    marginTop: 12,
    fontWeight: "bold",
  },
  username: {
    color: "gray",
    marginTop: 3,
  },
  ubication: {
    color: "gray",
    marginTop: 0,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  statsCard: {
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
  },
  postCard: {
    marginBottom: 12,
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: 200,
    alignSelf: "center",
  },
});

export default Profile;
