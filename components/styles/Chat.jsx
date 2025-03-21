import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f6f9',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      backgroundColor: '#007bff',
      paddingVertical: 15,
      paddingHorizontal: 20,
      elevation: 3,
    },
    headerTitle: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    messagesContainer: {
      padding: 15,
    },
    messageContainer: {
      maxWidth: '80%',
      padding: 10,
      borderRadius: 12,
      marginBottom: 10,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#dcf8c6',
      borderBottomRightRadius: 2,
    },
    otherMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#ffffff',
      borderBottomLeftRadius: 2,
    },
    messageText: {
      fontSize: 16,
      color: '#333',
    },
    timestamp: {
      fontSize: 12,
      color: '#999',
      alignSelf: 'flex-end',
      marginTop: 5,
    },
    inputContainer: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: '#ffffff',
    },
    input: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      maxHeight: 100,
    },
    sendButton: {
      backgroundColor: '#007bff',
      borderRadius: 25,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    disabledButton: {
      backgroundColor: '#cccccc',
    },
    sendButtonText: {
      color: '#ffffff',
      fontWeight: '600',
    },
  });

  export default styles