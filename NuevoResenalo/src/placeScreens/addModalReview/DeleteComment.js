import React, { useContext } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import Context from "../../Context/Context"; // Ajusta la ruta
import { useTranslation } from "react-i18next";
const DeleteComment = ({ isVisible, onClose, onConfirm, title }) => {
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
        <View style={[
          styles.modalContent, 
          { backgroundColor: isDark ? "#1e1e1e" : "white" }
        ]}>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {title || "¿Estás seguro?"}
          </Text>
          
          <View style={styles.modalButtonsRow}>
            <Pressable style={[styles.modalBtn, styles.btnNo]} onPress={onClose}>
              <Text style={styles.btnTextNo}>{t("response.negative")}</Text>
            </Pressable>

            <Pressable style={[styles.modalBtn, styles.btnSi]} onPress={onConfirm}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  btnNo: { backgroundColor: '#2654d1' },
  btnSi: { backgroundColor: '#DC3545' },
  btnTextNo: { color: 'white', fontWeight: 'bold' },
  btnTextSi: { color: 'white', fontWeight: 'bold' },
});

export default DeleteComment;