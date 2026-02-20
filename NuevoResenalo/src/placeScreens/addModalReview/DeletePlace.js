import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";

const DeleteModal = ({ isVisible, onClose, onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Estás seguro que quieres borrar esta ubicación?</Text>
          
          <View style={styles.modalButtonsRow}>
            <Pressable 
              style={[styles.modalBtn, styles.btnNo]} 
              onPress={onClose}
            >
              <Text style={styles.btnTextNo}>No</Text>
            </Pressable>

            <Pressable 
              style={[styles.modalBtn, styles.btnSi]} 
              onPress={onConfirm}
            >
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  modalContent: {
    width: '75%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  btnNo: { backgroundColor: '#2654d1' },
  btnSi: { backgroundColor: '#DC3545' },
  btnTextNo: { color: 'white', fontWeight: 'bold' },
  btnTextSi: { color: 'white', fontWeight: 'bold' },
});

export default DeleteModal;