import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({ region }) => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={region}
        scrollEnabled={false} 
        zoomEnabled={true} 
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