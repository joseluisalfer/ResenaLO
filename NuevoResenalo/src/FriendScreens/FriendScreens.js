import React from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileHeaderFriend from '../Componentes/Friends/ProfileHeaderFriend/ProfileHeaderFriend';
import ProfileStatsFriend from '../Componentes/Friends/ProfileStatsFriends/ProfileStatsFriend';
import PostList from '../Componentes/Friends/PostList/PostList';

const FriendScreens = () => {
  const navigation = useNavigation(); // Correctly using navigation here
 
  
  return (
    <View style={styles.container}>
      <ProfileHeaderFriend navigation={navigation}/>
      <ProfileStatsFriend/>
      <PostList/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
