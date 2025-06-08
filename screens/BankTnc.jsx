import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const BankTerms = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bank Details Terms & Conditions</Text>
      <Text style={styles.text}>
        1. All bank details entered here are strictly confidential and encrypted.
      </Text>
      <Text style={styles.text}>
        2. Your information will only be used for payment processing and refund mechanisms.
      </Text>
      <Text style={styles.text}>
        3. We comply with applicable data privacy laws and industry standards to protect your financial data.
      </Text>
      <Text style={styles.text}>
        4. You can edit or delete your bank details at any time by revisiting this screen.
      </Text>
      <Text style={styles.text}>
        5. Any fraudulent use of bank information is subject to account suspension and legal action.
      </Text>
      <Text style={styles.text}>
        By submitting your bank information, you agree to these terms.
      </Text>
    </ScrollView>
  );
};

export default BankTerms;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 24,
  },
});
