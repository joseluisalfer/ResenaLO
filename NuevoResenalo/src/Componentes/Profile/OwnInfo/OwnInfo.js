import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../ProfileImage/ProfileImage";
import Context from "../../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * OwnInfo Component: Displays the profile header for the current user,
 * including their avatar, handle, display name, and biography.
 */
const OwnInfo = ({ user, description, name }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Extract theme and dark mode status from Context
  const { theme, isDark } = useContext(Context);

  return (
    <View style={styles.container}>
      {/* User Avatar Component */}
      <ProfileImage />

      <View style={{ alignItems: "center" }}>
        {/* User handle with specialized color for light/dark readability */}
        <Text style={[styles.username, { color: isDark ? "#AAA" : "gray" }]}>
          @{user}
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        {/* User Display Name with theme-based color */}
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>

        {/* Biography/Description with theme-based color */}
        <Text style={[styles.bio, { color: theme.text }]}>{description}</Text>
      </View>

      {/* Navigation button to the Edit Profile screen */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.editButton}
      >
        {t("profile.buttonEdit")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  editButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: 200,
    alignSelf: "center",
    backgroundColor: "#1748ce",
  },
  username: {
    marginTop: 3,
  },
  name: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: "bold",
  },
  bio: {
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
});

export default OwnInfo;
