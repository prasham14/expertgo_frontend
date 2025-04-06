
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4DDD6'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#075E54',
    elevation: 4
  },
  backButton: {
    marginRight: 16
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0
  },
  messageText: {
    fontSize: 16,
    color: '#000000'
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4
  },
  timestamp: {
    fontSize: 12,
    color: '#666666',
    marginRight: 4
  },
  readStatus: {
    fontSize: 12,
    color: '#4FC3F7'
  },
  typingIndicator: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    margin: 8,
    alignSelf: 'flex-start'
  },
  typingText: {
    fontStyle: 'italic',
    color: '#555'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF'
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#128C7E',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#B0BEC5'
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
