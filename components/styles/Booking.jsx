import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
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
      marginBottom: 20,
      fontSize: 16,
    },
    notesInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: '#f8f8f8',
    },
    picker: {
      height: 50,
    },
    dateContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    datePickerContainer: {
      flex: 1,
      marginHorizontal: 2,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      backgroundColor: '#f8f8f8',
    },
    dateLabel: {
      textAlign: 'center',
      paddingTop: 5,
      fontSize: 12,
      color: '#666',
    },
    datePicker: {
      height: 120,
    },
    selectedTimeContainer: {
      backgroundColor: '#e8f4ff',
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      alignItems: 'center',
    },
    selectedTimeLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#0066cc',
      marginBottom: 4,
    },
    selectedTimeText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    spacer: {
      height: 40,
    }
  });

export default styles;