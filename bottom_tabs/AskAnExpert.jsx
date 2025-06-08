import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../components/styles/AskAnExpert';
const AskAnExpert = ({navigation }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [showAnswered, setShowAnswered] = useState(false);

  useEffect(() => {
    const fetchUserRole = async() => {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role);
      
      if (role === 'expert') {
        fetchQuestionsForExpert();
      }
    };

    fetchUserRole();
  }, []);

  const fetchQuestionsForExpert = async () => {
    setFetchingQuestions(true);
    try {
      const id = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://10.0.2.2:3000/ask/questions/${id}`);
      setQuestions(response.data.questions);
      setShowAnswered(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Error', 'Failed to fetch questions. Please try again.');
    } finally {
      setFetchingQuestions(false);
    }
  };

  const fetchAnsweredQuestions = async () => {
    setFetchingQuestions(true);
    try {
      const id = await AsyncStorage.getItem('userId');
      const endpoint = userRole === 'expert' 
        ? `http://10.0.2.2:3000/ask/expert-answered/${id}`
        : `http://10.0.2.2:3000/ask/user-answered/${id}`;
      
      const response = await axios.get(endpoint);
      setQuestions(response.data.questions);
      setShowAnswered(true);
    } catch (error) {
      console.error('Error fetching answered questions:', error);
      Alert.alert('Error', 'Failed to fetch answered questions. Please try again.');
    } finally {
      setFetchingQuestions(false);
    }
  };

  const handleSubmit = async () => { 
    const userId = await AsyncStorage.getItem('userId');
    
    if (!question.trim()) {
      Alert.alert('Error', 'Please enter a question before submitting.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://10.0.2.2:3000/ask/ask', {
        question,
        userId
      });
      
      Alert.alert(
        'Success!', 
        'Your question has been sent to an expert.',
      );
    } catch (error) {
      console.error('Error submitting question:', error);
      Alert.alert('Error', 'Failed to submit your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestionId(selectedQuestionId === questionId ? null : questionId);
    setAnswerText('');
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      Alert.alert('Error', 'Please enter an answer before submitting.');
      return;
    }

    setSubmittingAnswer(true);
    
    try {
      const id = selectedQuestionId;
      await axios.post(`http://10.0.2.2:3000/ask/answer/${id}`, {
        answer: answerText,
      });
      
      Alert.alert('Success!', 'Your answer has been submitted successfully.');
      setAnswerText('');
      setSelectedQuestionId(null);
      
      // Refresh questions list
      fetchQuestionsForExpert();
    } catch (error) {
      console.error('Error submitting answer:', error);
      Alert.alert('Error', 'Failed to submit your answer. Please try again.');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const renderUserView = () => {
    return (
      // <View style={styles.container}>
      //   <View style={styles.headerContainer}>
      //     <Ionicons name="help-circle" size={40} color="#007bff" />
      //     <Text style={styles.heading}>Ask an Expert</Text>
      //   </View>
        
      //   <View style={styles.toggleButtonsContainer}>
      //     <TouchableOpacity 
      //       style={[styles.toggleButton, !showAnswered && styles.activeToggleButton]}
      //       onPress={() => setShowAnswered(false)}
      //     >
      //       <Text style={[styles.toggleButtonText, !showAnswered && styles.activeToggleButtonText]}>
      //         Ask a Question
      //       </Text>
      //     </TouchableOpacity>
          
      //     <TouchableOpacity 
      //       style={[styles.toggleButton, showAnswered && styles.activeToggleButton]}
      //       onPress={fetchAnsweredQuestions}
      //     >
      //       <Text style={[styles.toggleButtonText, showAnswered && styles.activeToggleButtonText]}>
      //         My Answered Questions
      //       </Text>
      //     </TouchableOpacity>
      //   </View>
        
      //   {!showAnswered ? (
      //     <>
      //       <Text style={styles.subText}>
      //         Get personalized answers from verified experts in your field of interest
      //       </Text>
            
      //       <Text style={styles.label}>Your Question:</Text>
      //       <View style={styles.inputContainer}>
      //         <Ionicons name="chatbox-ellipses" size={24} color="#007bff" style={styles.icon} />
      //         <TextInput
      //           style={styles.input}
      //           placeholder="Type your question here..."
      //           placeholderTextColor="#888"
      //           value={question}
      //           onChangeText={setQuestion}
      //           multiline
      //           numberOfLines={4}
      //         />
      //       </View>
            
      //       <TouchableOpacity 
      //         style={[styles.button, (!question.trim() ) && styles.buttonDisabled]}
      //         onPress={handleSubmit}
      //         disabled={!question.trim() || loading}
      //       >
      //         {loading ? (
      //           <ActivityIndicator color="#FFF" />
      //         ) : (
      //           <>
      //             <Ionicons name="send" size={20} color="#FFF" style={styles.buttonIcon} />
      //             <Text style={styles.buttonText}>Submit Question</Text>
      //           </>
      //         )}
      //       </TouchableOpacity>
            
      //       <View style={styles.infoContainer}>
      //         <Ionicons name="information-circle" size={20} color="#007bff" />
      //         <Text style={styles.infoText}>
      //          Ask the experts
      //         </Text>
      //       </View>
      //     </>
      //   ) : (
      //     fetchingQuestions ? (
      //       <View style={styles.loadingContainer}>
      //         <ActivityIndicator size="large" color="#007bff" />
      //         <Text style={styles.loadingText}>Loading answered questions...</Text>
      //       </View>
      //     ) : (
      //       <FlatList
      //         data={questions}
      //         keyExtractor={(item) => item._id}
      //         renderItem={({ item }) => (
      //           <View style={styles.answeredQuestionCard}>
      //             <View style={styles.questionHeader}>
      //               <Text style={styles.categoryTag}>{item.category}</Text>
      //               <Text style={styles.timestamp}>
      //                 Answered on {new Date(item.updatedAt).toLocaleDateString()}
      //               </Text>
      //             </View>
                  
      //             <Text style={styles.questionText}>{item.question}</Text>
                  
      //             <View style={styles.answerDisplaySection}>
      //               <Text style={styles.answerLabel}>Expert's Answer:</Text>
      //               <Text style={styles.answerText}>{item.answer}</Text>
      //             </View>
      //           </View>
      //         )}
      //         ListEmptyComponent={
      //           <View style={styles.emptyContainer}>
      //             <Ionicons name="chatbox" size={60} color="#ccc" />
      //             <Text style={styles.emptyText}>
      //               No answered questions yet. Ask your first question!
      //             </Text>
      //           </View>
      //         }
      //       />
      //     )
      //   )}
      // </View>
      <View>
        <Text>
          Comming Soon......
        </Text>
      </View>
    );
  };

  const renderExpertView = () => {
    if (fetchingQuestions) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      );
    }

    return (
      <View style={styles.expertContainer}>
        <View style={styles.headerContainer}>
          <Ionicons name="person" size={40} color="#007bff" />
          <Text style={styles.heading}>Expert Dashboard</Text>
        </View>
        
        <View style={styles.toggleButtonsContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, !showAnswered && styles.activeToggleButton]}
            onPress={fetchQuestionsForExpert}
          >
            <Text style={[styles.toggleButtonText, !showAnswered && styles.activeToggleButtonText]}>
              Questions to Answer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleButton, showAnswered && styles.activeToggleButton]}
            onPress={fetchAnsweredQuestions}
          >
            <Text style={[styles.toggleButtonText, showAnswered && styles.activeToggleButtonText]}>
              My Answered Questions
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subText}>
          {showAnswered 
            ? "Questions you've answered in the past" 
            : "Answer questions from users based on your expertise"}
        </Text>
        
        {!showAnswered && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchQuestionsForExpert}
            disabled={fetchingQuestions}
          >
            <Ionicons name="refresh" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Refresh Questions</Text>
          </TouchableOpacity>
        )}
        
        <FlatList
          data={questions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View>
                  <Text style={styles.categoryTag}>{item.category}</Text>
                  <Text style={styles.timestamp}>
                    {showAnswered 
                      ? `Answered on ${new Date(item.updatedAt).toLocaleDateString()}`
                      : `Asked on ${new Date(item.createdAt).toLocaleDateString()}`}
                  </Text>
                </View>
                
                {!showAnswered && (
                  <TouchableOpacity 
                    style={[styles.answerButton, selectedQuestionId === item._id && styles.selectedButton]}
                    onPress={() => handleSelectQuestion(item._id)}
                  >
                    <Text style={styles.answerButtonText}>
                      {selectedQuestionId === item._id ? 'Cancel' : 'Answer'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <Text style={styles.questionText}>{item.question}</Text>
              
              {showAnswered && (
                <View style={styles.answerDisplaySection}>
                  <Text style={styles.answerLabel}>Your Answer:</Text>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
              
              {!showAnswered && selectedQuestionId === item._id && (
                <View style={styles.answerSection}>
                  <Text style={styles.answerLabel}>Your Answer:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Type your expert answer here..."
                      placeholderTextColor="#888"
                      value={answerText}
                      onChangeText={setAnswerText}
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.submitAnswerButton, !answerText.trim() && styles.buttonDisabled]}
                    onPress={handleSubmitAnswer}
                    disabled={!answerText.trim() || submittingAnswer}
                  >
                    {submittingAnswer ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>Submit Answer</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="clipboard" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                {showAnswered 
                  ? "You haven't answered any questions yet."
                  : "No questions available for you to answer at the moment."}
              </Text>
            </View>
          }
        />
      </View>
    );
  };
  
  return (
    <ScrollView style={styles.mainContainer}>
      {/* {userRole === 'user' ? (
        renderUserView()
      ) : userRole === 'expert' ? (
        renderExpertView()
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )} */}
     <View style={styles.container}>
  <Text style={styles.comingSoonText}>Coming Soon...</Text>
</View>

    </ScrollView>
  );
};

export default AskAnExpert;