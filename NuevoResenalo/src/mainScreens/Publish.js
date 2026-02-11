import React, { useState } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Keyboard, Pressable, Text, StyleSheet } from 'react-native';
import DatosPublish from '../Componentes/Publish/PublishData/PublishData'
import SelectorImagen from '../Componentes/Publish/ImageSelector/imageSelector';
import { useTranslation } from 'react-i18next'
import '../../assets/i18n/index';
const Publish = () => {
  const [imagenes, setImagenes] = useState([null]);
  const { t } = useTranslation(); 
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 120,
          }}
        >
          <Text style={styles.title}>{t("publishScreen.new_place")}</Text>

          <DatosPublish />

          <SelectorImagen imagenes={imagenes} setImagenes={setImagenes} />
        </ScrollView>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>{t("publishScreen.buttonAdd")}</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 12,
  },
  button: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default Publish;