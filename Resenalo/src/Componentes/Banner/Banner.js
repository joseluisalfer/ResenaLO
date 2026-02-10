import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
//import ImagenResenalo from '../../../assets/images/ReseñaLo_Banner';

const Banner = ({layout}) => {
  return (
    <View style={[styles.container, { height: layout.bannerHeight, width: layout.contentWidth }]}>
      <Image
        source={require('../../../assets/images/ResenaLo_Banner.jpeg')}
        style={styles.image}
        resizeMode='contain'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: '20%',
  },
  image: {
    width: '100%',
    height: '80%',
  },
});
export default Banner
