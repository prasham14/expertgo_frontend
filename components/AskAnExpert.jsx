import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AskAnExpert = () => {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question before submitting.');
      return;
    }
    Alert.alert('Submitted', 'Your question has been sent to an expert!');
    setQuestion('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Ask an Expert</Text>
      <Text style={styles.subText}>Get answers from industry professionals</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="#007bff" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Type your question here..."
          placeholderTextColor="#888"
          value={question}
          onChangeText={setQuestion}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Question</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AskAnExpert;
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 20,
    margin: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

