import React, { useContext } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import Context from "../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * DeleteModal: A specialized confirmation dialog used specifically
 * for deleting locations or sensitive items.
 */
const DeleteModal = ({ isVisible, onClose, onConfirm, title }) => {
  const { theme, isDark } = useContext(Context);
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDark ? "#1e1e1e" : "white" },
          ]}
        >
          {/* Fallback title handles both missing props and localization */}
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {title ||
              t("publishScreen.delete_confirm_fallback") ||
              "Are you sure you want to delete this location?"}
          </Text>

          <View style={styles.modalButtonsRow}>
            {/* Cancel / Keep Action */}
            <Pressable
              style={[styles.modalBtn, styles.btnNo]}
              onPress={onClose}
            >
              <Text style={styles.btnTextNo}>{t("response.negative")}</Text>
            </Pressable>

            {/* Confirm / Delete Action */}
            <Pressable
              style={[styles.modalBtn, styles.btnSi]}
              onPress={onConfirm}
            >
              <Text style={styles.btnTextSi}>{t("response.afirmative")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darkened backdrop to focus on the modal
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    // Elevation for Android
    elevation: 5,
    // Shadows for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnNo: {
    backgroundColor: "#2654d1",
  },
  btnSi: {
    backgroundColor: "#DC3545",
  },
  btnTextNo: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnTextSi: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeleteModal;
