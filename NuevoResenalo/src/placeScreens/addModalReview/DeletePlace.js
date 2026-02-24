import React, { useContext } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import Context from "../../Context/Context"; // Ajusta la ruta

const DeleteModal = ({ isVisible, onClose, onConfirm, title }) => {
  const { theme, isDark } = useContext(Context);

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
            {title || "¿Estás seguro que quieres borrar esta ubicación?"}
          </Text>
          
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Un poco más oscuro para que resalte el modal
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: {
    width: '80%', 
    borderRadius: 20, 
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
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
  btnNo: { 
    backgroundColor: '#2654d1' 
  },
  btnSi: { 
    backgroundColor: '#DC3545' 
  },
  btnTextNo: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16 
  },
  btnTextSi: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16 
  },
});

export default DeleteModal;