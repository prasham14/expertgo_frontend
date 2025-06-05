import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const CancelTnC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Cancellation Policy</Text>

      <Text style={styles.sectionTitle}>🟢 First Cancellation</Text>
      <Text style={styles.text}>
        Your first meeting cancellation is free of any charges. We understand that unexpected situations may arise, and we allow a one-time exception without any penalties.
      </Text>

      <Text style={styles.sectionTitle}>🔴 Subsequent Cancellations</Text>
      <Text style={styles.text}>
        If you cancel any future meetings after your first cancellation, a fine will be applied. This helps compensate users for their reserved time and encourages fair usage of the platform.
      </Text>

      <Text style={styles.sectionTitle}>💸 Fine Details</Text>
      <Text style={styles.text}>
        • The fine may vary depending on the user's time charges.{"\n"}
        • It will be calculated as a percentage of the booking amount or a fixed fee, whichever is applicable.{"\n"}
        • The deducted amount is non-refundable.
      </Text>

      <Text style={styles.sectionTitle}>📅 Rescheduling</Text>
      <Text style={styles.text}>
        You can choose to reschedule instead of cancelling to avoid any fines, depending on the user's availability.
      </Text>

      <Text style={styles.note}>
        *By continuing to use the platform, you agree to the cancellation policy outlined above.
      </Text>
    </ScrollView>
  );
};

export default CancelTnC;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#444'
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24
  },
  note: {
    marginTop: 30,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999'
  }
});
