import React, { useContext } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import Context from "../../Context/Context";
import { useTranslation } from "react-i18next";

/**
 * ConfirmationModal Component: A reusable pop-up used to confirm
 * sensitive actions like deleting comments, reviews, or logging out.
 */
const ConfirmationModal = ({ isVisible, onClose, onConfirm, title }) => {
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
          {/* Dynamic title based on context, fallback to standard text */}
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {title || t("alerts.confirm_title") || "¿Estás seguro?"}
          </Text>

          <View style={styles.modalButtonsRow}>
            {/* Cancel / Negative Button */}
            <Pressable
              style={[styles.modalBtn, styles.btnNo]}
              onPress={onClose}
            >
              <Text style={styles.btnTextNo}>{t("response.negative")}</Text>
            </Pressable>

            {/* Confirm / Positive Action Button */}
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker overlay for better focus
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10, // Higher elevation for better shadow on Android
    shadowColor: "#000", // iOS Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
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
  },
  btnTextSi: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ConfirmationModal;
