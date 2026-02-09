import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Podium = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Podio de lugares, con el top 10 lugares más populares</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});

export default Podium;
