import React, { useContext, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import Posts from "../Componentes/Profile/Posts/Posts";
import OwnInfo from "../Componentes/Profile/OwnInfo/OwnInfo";
import CardInfo from "../Componentes/Profile/CardInfo/CardInfo";
import ModalProfile from "../Componentes/Profile/ModalProfile/ModalProfile";
import Context from "../Context/Context";

const Profile = ({ navigation }) => {
  // 1. Extraemos theme e isDark del contexto
  const { emailLogged, isLoged, setIsLoged, theme, isDark } = useContext(Context);

  const refreshProfile = () => {
    console.log("Refreshing...");
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [])
  );

  const handleLogOut = () => {
    setIsLoged(false);
  };

  const handleChangeLanguage = (language) => {
    console.log(language);
  };

  const Header = () => (
    <View>
      <View style={styles.section}>
        <ModalProfile
          handleLogOut={handleLogOut}
          handleChangeLanguage={handleChangeLanguage}
        />
      </View>

      <View style={styles.section}>
        <OwnInfo
          name={emailLogged?.results?.name}
          user={emailLogged?.results?.user}
          description={emailLogged?.results?.description}
        />
      </View>

      <View style={styles.section}>
        <CardInfo />
      </View>

      <View style={styles.divider}>
        {/* 2. Ajustamos el color del divisor según el tema */}
        <Divider style={[styles.dividerLine, { backgroundColor: isDark ? "#444" : "#e0e0e0" }]} />
      </View>

      <View style={styles.postsSection}>
        <Posts navigation={navigation} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: "content" }]}
      renderItem={() => <Header />}
      keyExtractor={(item) => item.key}
      // 3. Aplicamos el color de fondo del tema al contenedor principal
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      // Aseguramos que el estilo de la lista también herede el fondo
      style={{ backgroundColor: theme.background }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // Quitamos el blanco fijo
    paddingBottom: 16,
    paddingTop: 40,
    minHeight: '100%', // Para asegurar que el fondo cubra toda la pantalla
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
    height: 1, // Un poco más definido
  },
});

export default Profile;