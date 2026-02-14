import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({ latitud, longitud }) => {
  const region = {
    latitude: parseFloat(latitud),
    longitude: parseFloat(longitud),
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={region} // Fijamos la región sin permitir cambios
        scrollEnabled={false}  // Deshabilitamos el desplazamiento
        zoomEnabled={false}    // Deshabilitamos el zoom
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Ubicación"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    marginTop: 20,
    height: 200, 
    borderRadius: 15,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject, 
  },
});

export default Map;
