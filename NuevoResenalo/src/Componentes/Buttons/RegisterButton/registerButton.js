import { t } from 'i18next';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next'
import '../../../../assets/i18n/index';
const Registrarse = (props) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => props.navigation.navigate('Register')} style={styles.buttom}>
        <Text style={styles.text_buttom}>{t("loginScreen.register")} </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttom: {
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 15,
    height: 50,
    width: 300,
    borderRadius: 10,
  },
  text_buttom: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
});

export default Registrarse;
