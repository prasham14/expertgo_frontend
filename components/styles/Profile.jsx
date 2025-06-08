// Profile Styles - Updated to match UI design
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // Profile title
  profileTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },

  // Main profile section
  profileMainSection: {
    backgroundColor: '#F0F0F2',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 3,
  },

  // Profile image container
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },

  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },

  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#666',
  },

  imageEditButton: {
    position: 'absolute',
    bottom: -5,
    right: width / 2 - 60,
    backgroundColor: '#4A80F0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // User info section
  userInfoSection: {
    alignItems: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },

  nameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },

  verificationBadge: {
    verificationBadge: {
      marginLeft: 8,
      backgroundColor: '#E0F7FA',
      borderRadius: 50,
      padding: 4,
    },
  },

  verifiedText: {
    fontSize: 14,
    color: '#4A80F0',
    fontWeight: '500',
  },

  emailSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  emailText: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },

  // Bio section
  bioContainer: {
    backgroundColor: '#F0F0F2',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },

  bioEditContainer: {
    marginTop: 10,
  },

  bioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },

  bioActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },

  saveButton: {
    backgroundColor: '#4A80F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  cancelButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },

  // Action buttons container
  actionButtonsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },

  actionButton: {
    backgroundColor: '#F0F0F2',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  actionButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },

  uploadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  uploadingText: {
    fontSize: 14,
    color: '#4A80F0',
    marginLeft: 8,
  },

  // Modal styles
  modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  elevation: 5,
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
modalInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginVertical: 10,
},
modalPrimaryButton: {
  backgroundColor: '#4A80F0',
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: 'center',
  marginTop: 10,
},
modalButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
modalSecondaryButton: {
  marginTop: 8,
  paddingVertical: 10,
  alignItems: 'center',
},
modalSecondaryButtonText: {
  color: '#4A80F0',
},


  // modalSecondaryButton: {
  //   backgroundColor: '#f0f0f0',
  //   borderRadius: 10,
  //   padding: 15,
  //   alignItems: 'center',
  //   marginTop: 10,
  // },

  // modalSecondaryButtonText: {
  //   color: '#333',
  //   fontSize: 16,
  //   fontWeight: '500',
  // },

  // OTP specific styles
  otpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 15,
  },

  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    width: 120,
    backgroundColor: '#f9f9f9',
  },

  textButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },

  linkText: {
    color: '#4A80F0',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },

  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginLeft: 8,
  },
  availabilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#ccc',
  },

  availabilityToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default styles;
