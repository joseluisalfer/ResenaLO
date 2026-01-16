import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');
const MAP_SIZE = width * 0.85;

const COORDS = {
  latitude: 39.47391,
  longitude: -0.37966,
};

export default function App() {

  useEffect(() => {
    async function requestPerms() {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
      }
    }
    requestPerms();
  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>📍 Valencia</Text>

      {/* MAPA CUADRADO CENTRADO */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          customMapStyle={mapStyle}
          initialRegion={{
            ...COORDS,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          showsUserLocation
          zoomEnabled
          rotateEnabled={false}
        >
          <Marker
            coordinate={COORDS}
            title="Ubicación seleccionada"
            description="39.47391, -0.37966"
          />
        </MapView>
      </View>

      <Text style={styles.subtitle}>
        Coordenadas: 39.47391, -0.37966
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 20,
  },

  mapWrapper: {
    width: MAP_SIZE,
    height: MAP_SIZE,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 14,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d1d1d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#304a7d' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0e1626' }],
  },
];
