import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

const DeleteModal = ({ isVisible, onClose, onConfirm, title }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title || "¿Estás seguro?"}</Text>
          
          <View style={styles.modalButtonsRow}>
            <Pressable style={[styles.modalBtn, styles.btnNo]} onPress={onClose}>
              <Text style={styles.btnTextNo}>No</Text>
            </Pressable>

            <Pressable style={[styles.modalBtn, styles.btnSi]} onPress={onConfirm}>
              <Text style={styles.btnTextSi}>Sí</Text>
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
  btnNo: { backgroundColor: '#f0f0f0' },
  btnSi: { backgroundColor: '#DC3545' },
  btnTextNo: { color: '#333', fontWeight: 'bold' },
  btnTextSi: { color: 'white', fontWeight: 'bold' },
});

export default DeleteModal;