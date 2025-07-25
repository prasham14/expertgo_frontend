import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop:10,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  bioInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#333',
    marginBottom: 10,
  },
  roundInput: {
    height: 44,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: '#4267b2',
    borderRadius: 16,
    padding: 4,
  },
  experienceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  experienceButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f4f4f4',
  },
  experienceButtonSelected: {
    backgroundColor: '#4267b2',
    borderColor: '#4267b2',
  },
  experienceButtonText: {
    color: '#333',
    fontSize: 13,
  },
  experienceButtonTextSelected: {
    color: '#fff',
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  timeInput: {
    width: 48,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#333',
  },
  timeSeparator: {
    marginHorizontal: 6,
    fontSize: 16,
    color: '#555',
  },
  amPmContainer: {
    flexDirection: 'row',
    marginLeft: 4,
    gap: 4,
  },
  amPmButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#eaeaea',
  },
  amPmButtonSelected: {
    backgroundColor: '#4267b2',
  },
  amPmText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#4267b2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
