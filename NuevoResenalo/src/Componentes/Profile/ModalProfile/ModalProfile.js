import React, { useState, useContext } from "react";
import { View, StyleSheet, Modal, Pressable, Text } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Context from "../../../Context/Context";
import { useTranslation } from "react-i18next";
import "../../../../assets/i18n/index"; 
import { postData } from "../../../services/Services";

/**
 * ModalProfile Component: Displays a settings menu for logout, 
 * language selection, and theme toggling.
 */
const ModalProfile = ({ handleLogOut }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showLanguageOptions, setShowLanguageOptions] = useState(false);
  const { t, i18n } = useTranslation();

  // Extract theme-related data and current user info from Context
  const { isDark, toggleTheme, theme, emailLogged } = useContext(Context);

  const handleCancelLanguageChange = () => {
    setShowLanguageOptions(false);
  };

  const handleChangeToLanguageSelection = () => {
    setShowLanguageOptions(true);
  };

  /**
   * Updates the application language locally and persists it to the backend.
   */
  const handleChangeLanguage = async (lang) => {
    i18n.changeLanguage(lang);

    try {
      await postData('http://44.213.235.160:8080/resenalo/updateLanguage', {
        email: emailLogged?.results?.email,
        language: lang,
      });
    } catch (error) {
      // API error handled silently to prioritize user experience
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={styles.iconContainer}
      >
        <Ionicons name="settings-outline" size={30} color={theme.text} />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Adaptive modal background color */}
          <View
            style={[
              styles.modalContent, 
              { backgroundColor: isDark ? "#1E1E1E" : "white" }
            ]}
          >
            {!showLanguageOptions ? (
              <>
                {/* Main Settings Menu */}
                <Button
                  onPress={handleLogOut}
                  mode="outlined"
                  style={styles.modalButton}
                  textColor={theme.text}
                >
                  {t("profile.logout")}
                </Button>
                
                <Button
                  onPress={handleChangeToLanguageSelection}
                  mode="outlined"
                  style={styles.modalButton}
                  textColor={theme.text}
                >
                  {t("profile.change_lang")}
                </Button>

                <Button
                  onPress={toggleTheme}
                  mode="outlined"
                  style={styles.modalButton}
                  textColor={theme.text}
                >
                  {isDark ? t("profile.light_mode") : t("profile.dark_mode")}
                </Button>

                <Button
                  onPress={() => setModalVisible(false)}
                  mode="contained"
                  style={styles.cancelButton}
                  labelStyle={styles.cancelButtonText}
                >
                  {t("profile.cancel")}
                </Button>
              </>
            ) : (
              <>
                {/* Language Selection Menu */}
                <Button
                  onPress={() => handleChangeLanguage("es")}
                  textColor={theme.text}
                >
                  {t("language.es")}
                </Button>
                <Button
                  onPress={() => handleChangeLanguage("ca")}
                  textColor={theme.text}
                >
                  {t("language.ca")}
                </Button>
                <Button
                  onPress={() => handleChangeLanguage("en")}
                  textColor={theme.text}
                >
                  {t("language.en")}
                </Button>
                <Button
                  onPress={() => handleChangeLanguage("zh")}
                  textColor={theme.text}
                >
                  {t("language.zh")}
                </Button>

                <Button
                  style={styles.exitButton}
                  onPress={handleCancelLanguageChange}
                  labelStyle={styles.exitButtonText}
                >
                  {t("profile.exit")}
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalButton: {
    marginBottom: 10,
    borderColor: "#555",
  },
  cancelButton: {
    backgroundColor: "#DC3545",
    borderColor: "#DC3545",
    marginBottom: 10,
  },
  cancelButtonText: {
    color: "white",
  },
  exitButton: {
    backgroundColor: "#DC3545",
    borderColor: "#DC3545",
  },
  exitButtonText: {
    color: "white",
  },
});

export default ModalProfile;