import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";

const TandC = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text style={styles.header}>Terms & Conditions</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to Expertgo. By accessing or using our application, you agree to comply with these Terms & Conditions. Please read them carefully before proceeding.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.text}>
          Users are expected to engage with the platform in a lawful and respectful manner. Any misuse, including fraudulent or harmful activities, is strictly prohibited and may result in account suspension or legal action.
        </Text>

        <Text style={styles.sectionTitle}>3. Account Security</Text>
        <Text style={styles.text}>
          You are solely responsible for maintaining the confidentiality of your account credentials. Please ensure your login information is secure and never shared with others.
        </Text>

        <Text style={styles.sectionTitle}>4. Content Ownership</Text>
        <Text style={styles.text}>
          All content available on this platform is either owned by Expertgo or licensed for use. Reproduction, distribution, or modification without prior written consent is strictly prohibited.
        </Text>

        <Text style={styles.sectionTitle}>5. Access to Google Calendar & Google Meet</Text>
        <Text style={styles.text}>
          To enable seamless scheduling and meeting creation, the app may request access to your Google Calendar and Google Meet services. By granting access, you consent to the app generating meeting links on your behalf.
        </Text>

        <Text style={styles.sectionTitle}>6. Modifications to Terms</Text>
        <Text style={styles.text}>
          Expertgo reserves the right to update or revise these Terms & Conditions at any time. Continued use of the app following such changes constitutes acceptance of the updated terms.
        </Text>

        <Text style={styles.footerText}>
          For questions or support, please contact us at jprasham3@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
};

export default TandC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
    color: "#007bff",
  },
  text: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
  footerText: {
    fontSize: 14,
    color: "#777",
    marginTop: 20,
    textAlign: "center",
  },
});
