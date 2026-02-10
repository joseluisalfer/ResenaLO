import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Text,
  useTheme,
  Divider,
} from "react-native-paper";

const mockPosts = [
  {
    id: "1",
    title: "Mi primera publicación",
    content: "Mi gran verano en 2024...",
  },
  { id: "2", title: "Un gran día", content: "La perdi con un traba..." },
  {
    id: "3",
    title: "React Native 🚀",
    content: "Me encanta desarrollar apps móviles.",
  },
];

const Profile = () => {
  const theme = useTheme();

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
          {/* Header Perfil */}
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={100}
              source={require("../../assets/images/SamuDown.jpeg")}
            />

            <Text variant="headlineSmall" style={styles.name}>
              Samuel Rodriguez
            </Text>

            <Text variant="bodyMedium" style={styles.username}>
              @samurodri
            </Text>

            <Text variant="bodyMedium" style={styles.bio}>
              Desarrollador móvil | Amante de las mujeres | LOL player
            </Text>

            <Button
              mode="contained"
              style={styles.editButton}
              onPress={() => console.log("Editar perfil")}
            >
              Editar Perfil
            </Button>
          </View>

          {/* Estadísticas */}
          <View style={styles.statsContainer}>
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
          </View>

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
    marginTop: 40
  },
  profileHeader: {
    alignItems: "center",
  },
  name: {
    marginTop: 12,
    fontWeight: "bold",
  },
  username: {
    color: "gray",
    marginTop: 4,
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
  editButton: {
    marginTop: 12,
    width: 200,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  postCard: {
    marginBottom: 12,
  },
});

export default Profile;
