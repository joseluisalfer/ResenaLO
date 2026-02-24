import React, { useContext } from 'react';
import { View, Pressable, Text, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import '../../../../assets/i18n/index';
import Context from '../../../Context/Context';

/**
 * ImageSelector Component: Allows users to pick multiple images 
 * from the gallery or camera. Automatically adds a new slot when an 
 * image is selected.
 */
const ImageSelector = ({ images, setImages }) => {
  const { t } = useTranslation();
  const { isDark } = useContext(Context);

  /**
   * Opens an alert to choose between gallery or camera for a specific index.
   */
  const handleSelectImage = async (index) => {
    Alert.alert(t("buttonAdd.add"), t("buttonAdd.option"), [
      {
        text: t("buttonAdd.gallery"),
        onPress: async () => {
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert(t("alerts.permissionGallery"));
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
          });

          if (!result.canceled) {
            updateImagesArray(index, result.assets[0]);
          }
        },
      },
      {
        text: t("buttonAdd.camera"),
        onPress: async () => {
          const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
          if (!permissionResult.granted) {
            Alert.alert(t("alerts.permissionCamera"));
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            updateImagesArray(index, result.assets[0]);
          }
        },
      },
      { text: t("buttonAdd.cancel"), style: 'cancel' },
    ]);
  };

  /**
   * Updates the images list and appends a new null slot if the last slot was filled.
   */
  const updateImagesArray = (index, asset) => {
    const updatedImages = [...images];
    updatedImages[index] = asset;
    
    // Add a new empty slot if we just filled the current last one
    if (index === images.length - 1) {
      updatedImages.push(null);
    }
    setImages(updatedImages);
  };

  return (
    <View style={styles.container}>
      {images.map((img, index) => (
        <Pressable 
          key={index} 
          onPress={() => handleSelectImage(index)} 
          style={[
            styles.photoSquare, 
            { 
              backgroundColor: isDark ? '#1A1A1A' : '#f5f5f5',
              borderColor: isDark ? '#444' : '#ccc'
            }
          ]}
        >
          {img ? (
            <Image source={{ uri: img.uri }} style={styles.photo} />
          ) : (
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
  photo: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 12 
  },
  plus: { 
    fontSize: 32 
  },
});

export default ImageSelector;