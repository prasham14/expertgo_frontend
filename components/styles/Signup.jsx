import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tnc :{
    textDecorationLine: "underline",
  fontWeight : "bold"
  },
  topBanner: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#1e3a5f",
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
     
    }),
  },
  topBannerText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  topBannerSubText: {
    color: "#EFEFEF",
    fontSize: 14,
    marginTop: 3,
    textAlign: "center",
  },
  logoContainer: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 40,
    border : "black"
  },
  taglineContainer: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  taglineText: {
    fontSize: 16,
    color: "#4A4A4A",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
    marginTop : 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b0bec5", 
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
    
    }),
  },
  passinput : {
    flex: 1, // Makes input take full width
    paddingVertical: 10,
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
    }),
  },
  eyeIcon: {
    paddingHorizontal: 3,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#1e3a5f", 
    paddingVertical: 14,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
      },
    
    }),
  },
  googleButton: {
    backgroundColor: "#3498DB", // Cool alternative accent
    paddingVertical: 14,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
      },
    }),
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
    width: "90%",
    alignSelf: "center",
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#B0B0B0",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#4A4A4A",
    fontWeight: "600",
  },
  loginText: {
    fontSize: 16,
    color: "#1e3a5f",
    marginTop: 10,
    textAlign: "center",
  },
  loginLink: {
    color: "#1e3a5f",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#B0B0B0",
    backgroundColor: "#FFFFFF",
  },
  footerText: {
    fontSize: 14,
    color: "#4A4A4A",
    marginBottom: 5,
  },
  termsText: {
    fontSize: 12,
    color: "#4A4A4A",
    textAlign: "center",
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 15,
  },
  timerText: {
    fontSize: 16,
    color: "#F2994A",
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: "#1e3a5f",
    paddingVertical: 10,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resendButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 10,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default styles;
