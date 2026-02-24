import React, { useContext, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Divider } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import Posts from "../Componentes/Profile/Posts/Posts";
import OwnInfo from "../Componentes/Profile/OwnInfo/OwnInfo";
import CardInfo from "../Componentes/Profile/CardInfo/CardInfo";
import ModalProfile from "../Componentes/Profile/ModalProfile/ModalProfile";
import Context from "../Context/Context";

/**
 * Profile Screen: Displays user information, statistics, and personal posts.
 * Uses a FlatList with a single-header approach to handle complex scrollable content
 * while maintaining performance.
 */
const Profile = ({ navigation }) => {
  // Access global state and styling tokens from Context
  const { emailLogged, setIsLoged, theme, isDark } = useContext(Context);

  const refreshProfile = () => {
    // Logic for re-fetching user data goes here
    console.log("Refreshing profile data...");
  };

  // Initial load
  useEffect(() => {
    refreshProfile();
  }, []);

  // Re-fetch data every time the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, []),
  );

  const handleLogOut = () => {
    setIsLoged(false);
  };

  const handleChangeLanguage = (language) => {
    console.log(`Language changed to: ${language}`);
  };

  /**
   * Header Component: Groups the profile sections together.
   * Encapsulated to keep the FlatList clean.
   */
  const ProfileHeader = () => (
    <View>
      {/* Settings and Logout Modal Trigger */}
      <View style={styles.section}>
        <ModalProfile
          handleLogOut={handleLogOut}
          handleChangeLanguage={handleChangeLanguage}
        />
      </View>

      {/* User Basic Info (Name, Handle, Bio) */}
      <View style={styles.section}>
        <OwnInfo
          name={emailLogged?.results?.name}
          user={emailLogged?.results?.user}
          description={emailLogged?.results?.description}
        />
      </View>

      {/* User Stats (Followers, Following, Reviews) */}
      <View style={styles.section}>
        <CardInfo />
      </View>

      {/* Themed Divider */}
      <View style={styles.divider}>
        <Divider
          style={[
            styles.dividerLine,
            { backgroundColor: isDark ? "#444" : "#e0e0e0" },
          ]}
        />
      </View>

      {/* Grid or List of User Posts */}
      <View style={styles.postsSection}>
        <Posts navigation={navigation} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={[{ key: "profile_content" }]}
      renderItem={() => <ProfileHeader />}
      keyExtractor={(item) => item.key}
      // Content container ensures the background covers the full scrollable area
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
      showsVerticalScrollIndicator={false}
      // Main style ensures the non-scrollable area also respects the theme
      style={{ backgroundColor: theme.background }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingTop: 40,
    minHeight: "100%",
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

export default Profile;
