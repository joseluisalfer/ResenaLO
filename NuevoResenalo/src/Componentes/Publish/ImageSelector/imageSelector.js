import React, { useContext } from 'react'; // Importamos useContext
import { View, Pressable, Text, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import '../../../../assets/i18n/index';
import Context from '../../../Context/Context'; // Importamos tu contexto

const SelectorImagen = ({ imagenes, setImagenes }) => {
  const { t } = useTranslation();
  
  // Extraemos theme e isDark del contexto
  const { theme, isDark } = useContext(Context);

  const seleccionarImagen = async (index) => {
    Alert.alert(t("buttonAdd.add"), t("buttonAdd.option"), [
      {
        text: t("buttonAdd.gallery"),
        onPress: async () => {
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert('Necesitamos permisos para acceder a la galería');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });

          if (!result.canceled) {
            const nuevas = [...imagenes];
            nuevas[index] = result.assets[0];
            if (index === imagenes.length - 1) nuevas.push(null);
            setImagenes(nuevas);
          }
        },
      },
      {
        text: t("buttonAdd.camera"),
        onPress: async () => {
          const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert('Necesitamos permisos para usar la cámara');
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            const nuevas = [...imagenes];
            nuevas[index] = result.assets[0];
            if (index === imagenes.length - 1) nuevas.push(null);
            setImagenes(nuevas);
          }
        },
      },
      { text: t("buttonAdd.cancel"), style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      {imagenes.map((img, indx) => (
        <Pressable 
          key={indx} 
          onPress={() => seleccionarImagen(indx)} 
          style={[
            styles.photoSquare, 
            { 
              // Fondo dinámico (negro suave en dark mode, gris claro en light)
              backgroundColor: isDark ? '#1A1A1A' : '#f5f5f5',
              // Borde dinámico
              borderColor: isDark ? '#444' : '#ccc'
            }
          ]}
        >
          {img ? (
            <Image source={{ uri: img.uri }} style={styles.photo} />
          ) : (
            // El símbolo "+" cambia de color según el tema
            <Text style={[styles.plus, { color: isDark ? '#fff' : '#aaa' }]}>+</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  photoSquare: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photo: { width: '100%', height: '100%', borderRadius: 12 },
  plus: { fontSize: 32 },
});

export default SelectorImagen;