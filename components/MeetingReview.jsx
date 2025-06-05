import React, { useState } from 'react';
import { StyleSheet,Modal,View,Text,TextInput,TouchableOpacity } from 'react-native';

const StarRating = ({ rating, setRating }) => {
  const renderStar = (position) => {
    const filled = position <= rating;
    return (
      <TouchableOpacity
        key={position}
        onPress={() => setRating(position)}
        style={styles.starContainer}
      >
        <Text style={[styles.star, filled ? styles.filledStar : styles.emptyStar]}>
          {filled ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map(position => renderStar(position))}
    </View>
  );
};

const MeetingReviewModal = ({ visible, onClose, userId, expertId, meetingId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setErrorMessage('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('http://10.0.2.2:3000/ratings/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          expertId,
          meetingId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Review submitted successfully
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrorMessage('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Meeting Completed</Text>
          <Text style={styles.subtitle}>How was your experience?</Text>
          
          <StarRating rating={rating} setRating={setRating} />
          
          <View style={styles.commentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Share your feedback (optional)"
              multiline={true}
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />
          </View>
          
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MeetingReviewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  starContainer: {
    padding: 5
  },
  star: {
    fontSize: 40
  },
  filledStar: {
    color: '#FFD700' // Gold color for filled stars
  },
  emptyStar: {
    color: '#C0C0C0' // Silver color for empty stars
  },
  commentContainer: {
    width: '100%',
    marginBottom: 20
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    height: 100,
    textAlignVertical: 'top'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: '#f0f0f0'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  },
  cancelText: {
    color: '#333'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  }
});