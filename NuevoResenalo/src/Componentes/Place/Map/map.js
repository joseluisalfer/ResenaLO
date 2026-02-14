import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({ latitud, longitud }) => {
  const lat = parseFloat(latitud);
  const lng = parseFloat(longitud);

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return <View style={[styles.mapContainer, { backgroundColor: '#f0f0f0' }]} />;
  }

  const region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView

        key={`${lat}-${lng}`} 
        style={styles.map}
        initialRegion={region}
        scrollEnabled={false} 
        zoomEnabled={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
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