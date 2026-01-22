import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import ImagenResenalo from '../../../assets/resenalo3.png';

const Imagen1 = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/resenalo3.png')}
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
export default Imagen1
