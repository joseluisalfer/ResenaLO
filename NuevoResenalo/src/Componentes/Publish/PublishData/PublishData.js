import React from 'react';
import { View, Text, Keyboard, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const FormInput = ({ label, placeholder }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      style={styles.input}
      onSubmitEditing={Keyboard.dismiss}
      dense
    />
  </View>
);

const DatosPublish = () => {
  return (
    <View>
      <FormInput label="NOMBRE" placeholder="Añadir nombre del lugar" />
      <FormInput label="UBICACIÓN" placeholder="Añadir coordenadas..." />
      <FormInput label="TIPO DE DESTINO" placeholder="Elige de qué tipo es" />
      <FormInput label="DESCRIPCIÓN" placeholder="Describe el lugar..." />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    width: 120,
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
  },
});

export default DatosPublish;
