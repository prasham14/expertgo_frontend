import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    dateButton: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#fff',
    },
    createButton: {
      backgroundColor: '#4267b2',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
      alignItems: 'center',
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    paymentDetails: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    detailText: {
      fontSize: 14,
      marginBottom: 5,
    },
    totalAmountLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 10,
    },
    totalAmount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2a9d8f',
    },
    paymentInputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    paymentInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      width: '100%',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButton: {
      padding: 12,
      borderRadius: 8,
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f8f9fa',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    payButton: {
      backgroundColor: '#4267b2',
    },
    cancelButtonText: {
      color: '#212529',
      fontWeight: '500',
    },
    payButtonText: {
      color: '#fff',
      fontWeight: '500',
    },
    paymentStatus: {
      marginTop: 10,
      color: '#28a745',
    },// Add to your styles
    slotContainer: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    slotText: {
      fontSize: 16,
      fontWeight: '500',
    },
    durationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    durationButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      margin: 5,
    },
    selectedDuration: {
      backgroundColor: '#007BFF',
    },
    durationText: {
      color: '#333',
    },
    selectedDurationText: {
      color: '#fff',
      fontWeight: '500',
    }
  });
  export default styles;