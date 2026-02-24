import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../Componentes/Profile/ProfileImage/ProfileImage";
import EditUser from "../Componentes/Profile/EditUser/EditUser";
import Context from "../Context/Context";

/**
 * EditProfile Screen: A container screen that allows users to change their
 * profile picture and update their account details via the EditUser form.
 */
const EditProfile = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  // Extract the global theme from Context
  const { theme } = useContext(Context);

  return (
    /**
     * Parent View with theme background prevents white flashes
     * during ScrollView "bouncing" on iOS.
     */
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        /**
         * flexGrow ensures the background covers the entire screen
         * even if the content is shorter than the device height.
         */
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: theme.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <ProfileImage image={image} setImage={setImage} />
        </View>

        {/* User Data Form Section */}
        <EditUser />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
});

export default EditProfile;
