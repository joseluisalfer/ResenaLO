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
  const { emailLogged, isLoged, setIsLoged } = useContext(Context);

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
        <Divider style={styles.dividerLine} />
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
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 16,
    paddingTop: 40,
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
  },
});

export default Profile;