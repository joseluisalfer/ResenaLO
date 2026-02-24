import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Images Component: A carousel-like viewer that displays a set of images
 * with navigation controls.
 */
const Images = ({ images, imagePos, nextImage, prevImage }) => {
  // Fallback UI when no images are provided
  if (!images || images.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="image-outline" size={50} color="#ccc" />
      </View>
    );
  }

  const currentImageUrl = images[imagePos];

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: currentImageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Navigation arrows only rendered if there is more than one image */}
      {images.length > 1 && (
        <>
          <TouchableOpacity style={styles.arrowLeft} onPress={prevImage}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.arrowRight} onPress={nextImage}>
            <Ionicons name="chevron-forward" size={28} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 250,
    backgroundColor: "#f4f4f4",
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  center: { justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: "100%" },
  arrowLeft: {
    position: "absolute",
    top: "45%",
    left: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 5,
  },
  arrowRight: {
    position: "absolute",
    top: "45%",
    right: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 5,
  },
});

export default Images;
