import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
  formContainer: {
    padding: 20
  },
  fieldContainer: {
    marginBottom: 20
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top'
  },
  dynamicInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  dynamicInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addButtonText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  removeButton: {
    marginLeft: 10
  },
  chargesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chargeInputContainer: {
    flex: 1,
    marginRight: 10
  },
  chargeLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5
  },
  chargeInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  experienceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  experienceButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10
  },
  experienceButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db'
  },
  experienceButtonText: {
    color: '#333',
    fontSize: 14
  },
  experienceButtonTextSelected: {
    color: '#fff'
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default styles;