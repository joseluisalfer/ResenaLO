import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const Banner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/ResenaLo_Banner.jpeg')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: '15%', // Reduce el espacio superior para que la imagen esté más arriba
  },
  image: {
    width: '100%',
    height: 200,  // Ajusta la altura si necesitas una imagen más pequeña
  },
});

export default Banner;
