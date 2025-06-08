import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header styles
  header: {
    paddingVertical: 20,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: -20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  
  // Form container
  formContainer: {
    paddingBottom: 30,
  },
  
  // Field container styles
  fieldContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  
  // Label styles
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#495057',
  },
  
  textArea: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#495057',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  
  // Experience selection styles
  experienceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  experienceButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  
  experienceButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  
  experienceButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  
  experienceButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Add button styles
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  
  addButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  
  // Dynamic input styles
  dynamicInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  dynamicInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#495057',
    marginRight: 8,
  },
  
  removeButton: {
    padding: 4,
  },
  
  // Charges container styles
  chargesContainer: {
    gap: 12,
  },
  
  chargeInputContainer: {
    marginBottom: 12,
  },
  
  chargeLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 6,
    fontWeight: '500',
  },
  
  chargeInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#495057',
  },
  
  // Button styles
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6c757d',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Additional utility styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  centerAlign: {
    alignItems: 'center',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  
  // Loading state styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  
  // Error states
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  
  errorInput: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  
  // Success states
  successText: {
    color: '#28a745',
    fontSize: 14,
    marginTop: 4,
  },
  
  // Disabled states
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  
  disabledText: {
    color: '#adb5bd',
  },
});

export default styles;