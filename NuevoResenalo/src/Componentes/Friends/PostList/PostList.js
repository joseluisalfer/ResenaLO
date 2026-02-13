import React from "react";
import { FlatList, Text, Card, StyleSheet } from "react-native";

const PostList = ({ posts }) => {
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
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    />
  );
};

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 12,
  },
});

export default PostList;
