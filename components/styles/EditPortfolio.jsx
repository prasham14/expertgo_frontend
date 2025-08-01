import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#333',
    },
    scrollView: {
      flex: 1,
    },
    header: {
      padding: 20,
      backgroundColor: '#007BFF',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    formContainer: {
      padding: 20,
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: 'white',
      color: '#333',
    },
    textArea: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: 'white',
      textAlignVertical: 'top',
      minHeight: 120,
      color: '#333',
    },
    experienceContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
    },
    experienceButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#4267b2',
      margin: 4,
      backgroundColor: 'white',
    },
    experienceButtonSelected: {
      backgroundColor: '#4267b2',
    },
    experienceButtonText: {
      color: '#4267b2',
      fontSize: 14,
    },
    experienceButtonTextSelected: {
      color: 'white',
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    addButtonText: {
      marginLeft: 4,
      color: '#4CAF50',
      fontWeight: 'bold',
    },
    dynamicInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    dynamicInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: 'white',
      color: '#333',
    },
    removeButton: {
      marginLeft: 10,
    },
    chargesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    chargeInputContainer: {
      flex: 1,
      marginHorizontal: 4,
    },
    chargeLabel: {
      fontSize: 14,
      marginBottom: 6,
      color: '#555',
    },
    chargeInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: 'white',
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#4267b2',
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: '#666',
      fontSize: 16,
    },// Add these to your styles object
    timingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeInput: {
      height: 40,
      width: 60,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      textAlign: 'center',
    },
    timeSeparator: {
      marginHorizontal: 10,
      fontSize: 18,
    },
    amPmSelector: {
      flexDirection: 'row',
      marginLeft: 10,
    },
    amPmOption: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    selectedAmPm: {
      backgroundColor: '#4267b2',
    },
    amPmText: {
      color: '#333',
    },
    selectedAmPmText: {
      color: '#fff',
    },
  });
export default styles  