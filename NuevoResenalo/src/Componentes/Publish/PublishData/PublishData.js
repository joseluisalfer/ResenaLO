import React, { useState, useContext } from 'react';
import { View, Text, Keyboard, StyleSheet, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import Context from '../../../Context/Context';

// 1. FormInput ahora usa theme.text para que cambie según el modo
const FormInput = ({ label, placeholder, value, onChangeText, theme }) => (
  <View style={[styles.row, { borderBottomColor: theme.isDark ? '#333' : '#ddd' }]}>
    <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    <TextInput
      mode="outlined"
      placeholder={placeholder}
      placeholderTextColor={theme.isDark ? "#666" : "#999"}
      style={[styles.input, { backgroundColor: theme.background }]}
      
      // COLORES DINÁMICOS AQUÍ:
      textColor={theme.text} 
      outlineColor={theme.text} 
      activeOutlineColor={theme.primary || theme.text}
      
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={Keyboard.dismiss}
      dense
    />
  </View>
);

const DatosPublish = () => {
  const { t } = useTranslation();
  // 2. Extraemos el theme del Contexto
  const { publishInfo, setPublishInfo, theme } = useContext(Context);

  const [title, setTitle] = useState(publishInfo.title);
  const [ubication, setUbication] = useState(publishInfo.coords); 
  const [type, setType] = useState(publishInfo.type);
  const [description, setDescription] = useState(publishInfo.description);
  const [rating, setRating] = useState(publishInfo.valoration);

  const handleTitleChange = (text) => {
    setTitle(text);
    setPublishInfo({ ...publishInfo, title: text });
  };

  const handleUbicationChange = (text) => {
    setUbication(text);
    setPublishInfo({ ...publishInfo, coords: text });
  };

  const handleTypeChange = (text) => {
    setType(text);
    setPublishInfo({ ...publishInfo, type: text });
  };

  const handleDescriptionChange = (text) => {
    setDescription(text);
    setPublishInfo({ ...publishInfo, description: text });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setPublishInfo({ ...publishInfo, valoration: newRating });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => handleRatingChange(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={40}
            color={i <= rating ? 'gold' : 'gray'}
          />
        </Pressable>
      );
    }
    return stars;
  };

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
      {/* 3. Pasamos el theme a cada input para que el texto sea negro o blanco según toque */}
      <FormInput label="Nombre del lugar" placeholder="Nuevo lugar" value={title} onChangeText={handleTitleChange} theme={theme} />
      <FormInput label="Ubicación" placeholder="Ejemplo: 40.7128,-74.0060" value={ubication} onChangeText={handleUbicationChange} theme={theme} />
      <FormInput label="Tipo" placeholder="Tipo de lugar" value={type} onChangeText={handleTypeChange} theme={theme} />
      <FormInput label="Descripción" placeholder="Descripción del lugar" value={description} onChangeText={handleDescriptionChange} theme={theme} />

      <View style={styles.starContainer}>
        {renderStars()}
      </View>

      <Pressable style={styles.resetButton} onPress={resetForm}>
        <Text style={styles.buttonText}>Restablecer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  label: {
    width: 120,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 40,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DatosPublish;