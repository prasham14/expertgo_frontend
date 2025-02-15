import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      {/* Home Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Settings Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
