import React from "react";
import { StyleSheet, View, Image } from "react-native";

/**
 * Banner Component: Renders the main brand image at the top
 */
const Banner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/ResenaLo_Banner.jpeg")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: "15%",
  },
  image: {
    width: "100%",
    height: 200,
  },
});

export default Banner;
