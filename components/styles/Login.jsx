import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topBanner: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#1e3a5f", // Deep navy blue for a premium look
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "center",
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  topBannerText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  topBannerSubText: {
    color: "#d6e4f0", // Soft bluish-gray for a subtle contrast
    fontSize: 14,
    marginTop: 3,
    textAlign: "center",
  },
  logoContainer: {
    marginTop: 100,
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  input: {
    width: "90%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b0bec5", // Soft gray border
    marginBottom: 15,
    backgroundColor: "#ffffff",
    color: "#333",
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  passinput : {
    flex: 1, // Makes input take full width
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: "#1565c0", // Vibrant blue for clickable links
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#1e3a5f", // Matching the banner for consistency
    paddingVertical: 16,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 15,
    fontSize: 16,
    color: "#607d8b", // Muted blue-gray for subtlety
    textAlign: "center",
  },
  signupLink: {
    color: "#1565c0",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    padding: 25,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  timerText: {
    fontSize: 16,
    color: "#d32f2f", // Deep red for urgency
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: "#2e7d32", // Deep green for success
    paddingVertical: 12,
    borderRadius: 12,
    width: "70%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resendButton: {
    backgroundColor: "#c62828", // Deep red for alerting actions
    paddingVertical: 12,
    borderRadius: 12,
    width: "70%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#b0bec5", 
    backgroundColor: "#ffffff",
  },
  footerText: {
    fontSize: 14,
    color: "#1e3a5f",
    marginBottom: 5,
  },
  termsText: {
    fontSize: 12,
    color: "#607d8b",
    textAlign: "center",
  },
  tnc :{
    textDecorationLine: "underline",
  fontWeight : "bold"
  },
  modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
      width: "80%",
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      elevation: 5, // For Android shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4, // For iOS shadow
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      color: "#333",
      textAlign: "center",
  },
  roleButton: {
      width: "100%",
      paddingVertical: 12,
      marginVertical: 10,
      backgroundColor: "#1e3a5f", // Blue color for buttons
      borderRadius: 8,
      alignItems: "center",
  },
  buttonText: {
      fontSize: 16,
      color: "#fff",
      fontWeight: "600",
  },
});


export default styles;
