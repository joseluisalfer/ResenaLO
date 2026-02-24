import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

/**
 * Map Component: Displays a non-interactive map preview for a specific location.
 */
const Map = ({ latitud, longitud }) => {
  const lat = parseFloat(latitud);
  const lng = parseFloat(longitud);

  // Fallback UI if coordinates are missing or invalid
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return (
      <View style={[styles.mapContainer, { backgroundColor: "#f0f0f0" }]} />
    );
  }

  // Define the visible area around the coordinates
  const region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        // Key forcing a re-render if coordinates change
        key={`${lat}-${lng}`}
        style={styles.map}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          title="Location"
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
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
