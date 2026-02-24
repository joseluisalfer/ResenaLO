import React, { useState, useEffect, useContext } from "react";
import Context from "../../../Context/Context";
import {
  View,
  Pressable,
  Image,
  Alert,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";

/**
 * ProfileImage Component: Handles profile picture display and updates.
 * Supports image picking from gallery or camera and converts files to Base64 for uploads.
 */
const ProfileImage = () => {
  const { emailLogged, setEmailLogged, theme, isDark } = useContext(Context);
  const { t } = useTranslation();

  const userEmail = emailLogged?.results?.email || null;
  const currentImage =
    emailLogged?.results?.photo || emailLogged?.results?.image || null;

  const [imageUri, setImageUri] = useState(currentImage);
  const [updating, setUpdating] = useState(false);

  // Sync internal state if the context image changes
  useEffect(() => {
    setImageUri(currentImage);
  }, [currentImage]);

  /**
   * Converts a local URI to a clean Base64 string for server upload.
   */
  const toBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result;
        // Strip the data:image/xxx;base64, prefix
        const cleanBase64 = String(base64String).split(",")[1] || "";
        resolve(cleanBase64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  /**
   * Performs the PUT request to update the user's photo on the server.
   */
  const putPhoto = async ({ email, file }) => {
    const url = "http://44.213.235.160:8080/resenalo/updatePhoto";
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, file }),
    });

    const raw = await res.text().catch(() => "");
    if (!res.ok)
      throw new Error(`HTTP ${res.status} - ${raw || "No response body"}`);

    try {
      return JSON.parse(raw);
    } catch {
      // Fallback if the server returns a plain string URL instead of JSON
      return { imageUrl: raw };
    }
  };

  /**
   * Processes the selected image: converts to Base64, uploads, and updates global state.
   */
  const handleUpdatePhoto = async (uri) => {
    try {
      if (!userEmail) {
        Alert.alert(t("alerts.errorSession"));
        return;
      }
      setUpdating(true);

      const base64Clean = await toBase64(uri);
      if (!base64Clean || base64Clean.length < 50) {
        Alert.alert(t("alerts.isInvalidImage"));
        return;
      }

      const serverResponse = await putPhoto({
        email: userEmail,
        file: base64Clean,
      });

      const publicUrl = serverResponse?.imageUrl;
      if (!publicUrl || !String(publicUrl).startsWith("http")) {
        Alert.alert(t("alerts.errorUrl"));
        return;
      }

      // Update local and global states
      setImageUri(publicUrl);
      setEmailLogged((prev) => ({
        ...prev,
        results: {
          ...(prev?.results || {}),
          photo: publicUrl,
          image: publicUrl,
        },
      }));
    } catch (e) {
      Alert.alert(t("alerts.errorImage"));
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Displays an action sheet to choose between Camera or Photo Gallery.
   */
  const selectImage = async () => {
    if (!userEmail) return Alert.alert(t("alerts.errorSession"));

    Alert.alert(t("alerts.changeImage") || "Profile Picture", "", [
      {
        text: t("buttonAdd.gallery") || "Gallery",
        onPress: async () => {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) return Alert.alert(t("alerts.permissionGallery"));
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
          });
          if (!result.canceled) handleUpdatePhoto(result.assets[0].uri);
        },
      },
      {
        text: t("buttonAdd.camera") || "Camera",
        onPress: async () => {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return Alert.alert(t("alerts.permissionCamera"));
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
          });
          if (!result.canceled) handleUpdatePhoto(result.assets[0].uri);
        },
      },
      {
        text: t("buttonAdd.cancel") || "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={selectImage}
        style={[
          styles.photoSquare,
          {
            borderColor: isDark ? "#444" : "#ccc",
            backgroundColor: isDark ? "#222" : "#f5f5f5",
          },
        ]}
        disabled={updating}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.photo} />
        ) : (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: isDark ? "#333" : "#ddd" },
            ]}
          >
            <Text
              style={[styles.photoText, { color: isDark ? "#aaa" : "#888" }]}
            >
              {t("profile.upload_photo") || "Upload photo"}
            </Text>
          </View>
        )}

        {updating && (
          <View
            style={[
              styles.loadingOverlay,
              {
                backgroundColor: isDark
                  ? "rgba(0,0,0,0.6)"
                  : "rgba(255,255,255,0.6)",
              },
            ]}
          >
            <ActivityIndicator
              color={theme.primary || "#1748ce"}
              size="small"
            />
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 35, alignItems: "center" },
  photoSquare: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%" },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  photoText: { fontSize: 12, textAlign: "center", paddingHorizontal: 5 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileImage;
