import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import PublishData from "../Componentes/Publish/PublishData/PublishData";
import ImageSelector from "../Componentes/Publish/ImageSelector/imageSelector";
import { useTranslation } from "react-i18next";
import "../../assets/i18n/index";
import { postData } from "../services/Services";
import Context from "../Context/Context";

/**
 * Publish Screen: Handles the creation of new location reviews.
 * Users can fill in data (title, rating, description, coordinates)
 * and upload multiple images which are converted to Base64 for the API.
 */
const Publish = () => {
  const [images, setImages] = useState([null]);
  const { t } = useTranslation();

  // Extract theme and global state from Context
  const { publishInfo, setPublishInfo, emailLogged, theme, isDark } =
    useContext(Context);

  /**
   * Utility to convert image URIs to Base64 strings for server-side processing.
   */
  const convertImageToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          let base64 = reader.result;
          base64 = base64.split(",")[1]; // Remove the data type prefix
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Conversion error:", error);
      return null;
    }
  };

  /**
   * Validates form data and sends the review payload to the backend.
   */
  const handleAddMap = async () => {
    const { title, coords, type, description, valoration } = publishInfo;

    // Basic validation check
    if (
      !title ||
      !coords ||
      !type ||
      !description ||
      !valoration ||
      !images.length ||
      !images[0]
    ) {
      Alert.alert(t("alerts.error"), t("alerts.publishScreen"));
      return;
    }

    // Ensure coordinates are properly formatted (Latitude, Longitude)
    if (!coords.includes(",")) {
      Alert.alert(t("alerts.error"), t("alerts.latitude"));
      return;
    }

    const base64Images = await Promise.all(
      images
        .filter((img) => img !== null)
        .map((img) => convertImageToBase64(img.uri)),
    );

    const data = {
      title: title,
      user: emailLogged?.results?.user || t("alerts.anonim"),
      valoration: valoration,
      description: description,
      type: type,
      coords: coords,
      files: base64Images,
    };

    try {
      const response = await postData(
        "http://44.213.235.160:8080/resenalo/uploadReview",
        data,
      );

      // In this API, a null response indicates a successful 200/204 status
      if (response === null) {
        Alert.alert(t("alerts.success"), t("alerts.excelentPublish"));
      } else {
        Alert.alert(t("alerts.error"), t("alerts.errorPublish"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(t("alerts.error"), t("alerts.errorConnection"));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <ScrollView
          style={{ backgroundColor: theme.background }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 160, // Prevents bottom buttons from overlapping content
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {t("publishScreen.new_place")}
          </Text>

          {/* Form data inputs */}
          <PublishData setFormData={setPublishInfo} />

          {/* Visual image picker grid */}
          <ImageSelector images={images} setImages={setImages} />
        </ScrollView>

        {/* Action Buttons: Positioned absolutely at the bottom */}
        <Pressable
          style={[styles.removeButton, { backgroundColor: "#DC3545" }]}
          onPress={() => setImages([null])}
        >
          <Text style={styles.buttonText}>
            {t("publishScreen.buttonDelete")}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.primary || "#2654d1" },
          ]}
          onPress={handleAddMap}
        >
          <Text style={styles.buttonText}>{t("publishScreen.buttonAdd")}</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButton: {
    position: "absolute",
    bottom: 85,
    left: 16,
    right: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
});

export default Publish;
