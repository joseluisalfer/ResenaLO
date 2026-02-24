import React, { useState, useContext } from "react";
import { View, Text, Keyboard, StyleSheet, Pressable } from "react-native";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Context from "../../../Context/Context";

/**
 * FormInput: A specialized input field that adapts its colors
 * based on the current theme (Light/Dark mode).
 */
const FormInput = ({ label, placeholder, value, onChangeText, theme }) => (
  <View
    style={[styles.row, { borderBottomColor: theme.isDark ? "#333" : "#ddd" }]}
  >
    <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      placeholderTextColor={theme.isDark ? "#666" : "#999"}
      style={[styles.input, { backgroundColor: theme.background }]}
      // Dynamic color mapping for text and borders
      textColor={theme.text}
      outlineColor={theme.isDark ? "#444" : "#ccc"}
      activeOutlineColor={theme.primary || theme.text}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={Keyboard.dismiss}
      dense
    />
  </View>
);

/**
 * PublishData Component: Collects data for a new review/post,
 * including title, location, type, description, and star rating.
 */
const PublishData = () => {
  const { t } = useTranslation();

  // Access global state and theme from Context
  const { publishInfo, setPublishInfo, theme } = useContext(Context);

  const [title, setTitle] = useState(publishInfo.title);
  const [ubication, setUbication] = useState(publishInfo.coords);
  const [type, setType] = useState(publishInfo.type);
  const [description, setDescription] = useState(publishInfo.description);
  const [rating, setRating] = useState(publishInfo.valoration);

  // Helper to update both local and global state
  const updateInfo = (key, value) => {
    setPublishInfo({ ...publishInfo, [key]: value });
  };

  const handleTitleChange = (text) => {
    setTitle(text);
    updateInfo("title", text);
  };

  const handleUbicationChange = (text) => {
    setUbication(text);
    updateInfo("coords", text);
  };

  const handleTypeChange = (text) => {
    setType(text);
    updateInfo("type", text);
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    updateInfo("description", text);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    updateInfo("valoration", newRating);
  };

  /**
   * Renders 5 interactive stars for the rating system.
   */
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => handleRatingChange(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={40}
            color={i <= rating ? "gold" : "gray"}
          />
        </Pressable>,
      );
    }
    return stars;
  };

  /**
   * Clears all local inputs and resets the global publishInfo object.
   */
  const resetForm = () => {
    setTitle("");
    setUbication("");
    setType("");
    setDescription("");
    setRating(0);
    setPublishInfo({
      title: "",
      coords: "",
      type: "",
      description: "",
      valoration: 0,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Input group with localized labels and placeholders */}
      <FormInput
        label={t("publishScreen.name")}
        placeholder={t("publishScreen.new_name")}
        value={title}
        onChangeText={handleTitleChange}
        theme={theme}
      />
      <FormInput
        label={t("publishScreen.location")}
        placeholder={t("publishScreen.new_location")}
        value={ubication}
        onChangeText={handleUbicationChange}
        theme={theme}
      />
      <FormInput
        label={t("publishScreen.type")}
        placeholder={t("publishScreen.new_type")}
        value={type}
        onChangeText={handleTypeChange}
        theme={theme}
      />
      <FormInput
        label={t("publishScreen.description")}
        placeholder={t("publishScreen.new_description")}
        value={description}
        onChangeText={handleDescriptionChange}
        theme={theme}
      />

      <View style={styles.starContainer}>{renderStars()}</View>

      <Pressable style={styles.resetButton} onPress={resetForm}>
        <Text style={styles.buttonText}>
          {t("publishScreen.buttonRestart")}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  label: {
    width: 120,
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    height: 40,
  },
  starContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default PublishData;
