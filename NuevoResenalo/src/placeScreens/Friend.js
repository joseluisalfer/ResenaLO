import React, { useContext } from "react"; // Importamos useContext
import { View, StyleSheet, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import ProfileHeaderFriend from "../Componentes/Friends/ProfileHeaderFriend";
import ProfileStatsFriend from "../Componentes/Friends/ProfileStatsFriend";
import Posts from "../Componentes/Friends/PostList";
import Context from "../Context/Context"; // Importamos tu Contexto

const Friend = () => {
  const navigation = useNavigation();
  
  // Extraemos theme e isDark del contexto
  const { theme, isDark } = useContext(Context);

  const ListHeader = () => (
    <View style={{ backgroundColor: theme.background }}>
      {/* Header/info amigo */}
      <View style={styles.section}>
        <ProfileHeaderFriend navigation={navigation} />
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <ProfileStatsFriend />
      </View>

      {/* Divider dinámico */}
      <View style={styles.divider}>
        <Divider style={[styles.dividerLine, { backgroundColor: isDark ? "#333" : "#ddd" }]} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: "posts" }]}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={<ListHeader />}
      renderItem={() => (
        <View style={[styles.postsSection, { backgroundColor: theme.background }]}>
          <Posts navigation={navigation} />
        </View>
      )}
      // Fondo dinámico para el contenedor y la lista
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      style={{ backgroundColor: theme.background }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingTop: 20,
    flexGrow: 1, // Para que el color de fondo cubra toda la pantalla
  },
  section: {
    marginBottom: 16,
  },
  postsSection: {
    paddingHorizontal: 16,
  },
  divider: {
    alignItems: "center",
  },
  dividerLine: {
    marginVertical: 16,
    width: "80%",
    height: 1,
  },
});

export default Friend;