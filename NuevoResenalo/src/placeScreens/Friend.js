import React from "react";
import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import { Button, Card, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const mockPosts = [
  {
    id: "1",
    title: "En Catarroja hay moros",
    content: "No lo digo yo, lo dice la gente, ¡vaya locura! 😂",
  },
  { 
    id: "2", 
    title: "Que no lo vea mi madre!", 
    content: "Que no vea mi madre ese mueble de la basura que se lo lleva para casa!!! 😲"
  },
  {
    id: "3", 
    title: "Un secretillo", 
    content: "Y un secretillo... he comido jamón. 🤫"
  },
];

const FriendProfile = () => {
  const navigation = useNavigation();

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
          <Ionicons 
            name="arrow-back" 
            size={30} 
            color="black" 
            style={styles.backButton} 
            onPress={() => navigation.goBack()} 
          />
          <View style={styles.profileImageContainer}>
            <Image source={require("../../assets/images/Konoha.png")} style={styles.profileImage} />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text variant="bodyMedium" style={styles.username}>
              @مثلي الجنس
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text variant="headlineSmall" style={styles.name}>
              Aymane El Hamoudi
            </Text>

            <Text variant="bodyMedium" style={styles.ubication}>
              Catarroja, España
            </Text>

            <Text variant="bodyMedium" style={styles.bio}>
              Amante de ChatGPT | Portatil Nº8 | ¡Hazme un bizzum payo!
            </Text>
          </View>

          <Card style={styles.statsCard}>
            <Card.Content style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="titleMedium">24</Text>
                <Text variant="bodySmall">Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">100</Text>
                <Text variant="bodySmall">Comentarios</Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleMedium">180</Text>
                <Text variant="bodySmall">Amigos</Text>
              </View>
            </Card.Content>
          </Card>

          <Divider style={styles.divider} />

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
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    width: "90%",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  postCard: {
    marginBottom: 12,
  },
  publicationsTitle: {
    textAlign: "left",
    marginLeft: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 16,
    width: "100%",
    backgroundColor: "#ddd",
  },
});

export default FriendProfile;
