import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
//import ImagenResenalo from '../../../assets/images/ReseñaLo_Banner';

const Banner = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/ResenaLo_Banner.jpeg')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: '15%',
  },
  image: {
    width: '100%',
    height: 230,
  },
});
export default Banner
