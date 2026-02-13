import React from "react";
import { View, StyleSheet, Text, Divider } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native"; // Added useNavigation import
import ProfileHeader from '../Componentes/Friends/ProfileHeaderFriend/ProfileHeaderFriend';
import ProfileStats from '../Componentes/Friends/ProfileStatsFriends/ProfileStatsFriend';
import PostList from '../Componentes/Friends/PostList/PostList';
import '../../assets/i18n/index'; // Localization

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

const FriendScreens = () => {
  const route = useRoute(); // Access route params
  const { friendId } = route.params; // Get the friendId passed from the previous screen

  const navigation = useNavigation(); // Correctly importing and using useNavigation

  return (
    <View style={styles.container}>
      <ProfileHeader 
        navigation={navigation} 
        username="@مثلي الجنس"
        name="Aymane El Hamoudi"
        location="Catarroja, España"
        bio="Amante de ChatGPT | Portatil Nº8 | ¡Hazme un bizzum payo!"
      />
      <ProfileStats 
        postsCount={24} 
        commentsCount={100} 
        friendsCount={180} 
      />
      <Divider style={styles.divider} />
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>
        {t("profile.post")}
      </Text>
      <PostList posts={mockPosts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginTop: 40,
    alignItems: "center",
  },
  divider: {
    marginVertical: 16,
    width: "100%",
    backgroundColor: "#ddd",
  },
});

export default FriendScreens;
