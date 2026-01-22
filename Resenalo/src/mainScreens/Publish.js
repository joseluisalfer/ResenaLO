import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


const Publish = () => {
  const [imagenes, setImagenes] = useState([null, null, null, null]);
  const seleccionarImagen = (index) => {
    Alert.alert('Añadir imagen', 'Elige una opción', [
      {
        text: 'Galería',
        onPress: () => {
          launchImageLibrary(
            { mediaType: 'photo', quality: 0.7 },
            (response) => {
              if (!response.didCancel && !response.errorCode) {
                const nuevasImagenes = [...imagenes];
                nuevasImagenes[index] = response.assets[0];
                setImagenes(nuevasImagenes);
              }
            }
          );
        },
      },
      {
        text: 'Cámara',
        onPress: () => {
          launchCamera({ mediaType: 'photo', quality: 0.7 }, (response) => {
            if (!response.didCancel && !response.errorCode) {
              const nuevasImagenes = [...imagenes];
              nuevasImagenes[index] = response.assets[0];
              setImagenes(nuevasImagenes);
            }
          });
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Añadir nuevo lugar</Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <Text style={styles.label}>NOMBRE</Text>
              <TextInput
                mode="outlined"
                placeholder="Añadir nombre del lugar"
                style={styles.input}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>UBICACIÓN</Text>
              <TextInput
                mode="outlined"
                placeholder="Añadir coordenadas..."
                style={styles.input}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>TIPO DE DESTINO</Text>
              <TextInput
                mode="outlined"
                placeholder="Elige de qué tipo es"
                style={styles.input}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>DESCRIPCIÓN</Text>
              <TextInput
                mode="outlined"
                placeholder="Describe el lugar..."
                style={styles.input}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginVertical: 16,
              }}>
              {imagenes.map((img, indx) => (
                <Pressable
                  key={indx}
                  onPress={() => seleccionarImagen(indx)}
                  style={styles.photoSquare}>
                  {img ? (
                    <Image
                      source={{ uri: img.uri }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 12,
                      }}
                    />
                  ) : (
                    <Text style={{ fontSize: 32, color: '#aaa' }}>+</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
          <View style={{ marginTop: 'auto' }}>
            <Pressable style={styles.button} onPress={{}}>
              <Text style={{ color: 'white', textAlign: 'center' }}>
                Añadir al mapa
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 12,
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  button: {
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoSquare: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
});
export default Publish;
