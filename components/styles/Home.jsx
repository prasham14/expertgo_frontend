
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

headerControls: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F5F7FA',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 8,
  flex: 1,
  marginRight: 10,
},
searchIcon: {
  marginRight: 8,
},
searchPlaceholder: {
  color: '#8E8E93',
  fontSize: 14,
},
headerButtons: {
  flexDirection: 'row',
  alignItems: 'center',
},
iconButton: {
  padding: 8,
  borderRadius: 20,
  backgroundColor: '#F5F7FA',
  marginLeft: 8,
},
  // Header styles
  headerBackground: {
    height: 120,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
  
  // Scroll container
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A6572',
  },
  
  // Expert dashboard
  expertDashboard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 15,
    padding: 35,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  
  // Portfolio container
 // Modal styles
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
modalContent: {
  backgroundColor: '#FFF',
  borderRadius: 15,
  width: '90%',
  maxWidth: 400,
  overflow: 'hidden',
},
portfolioContainer: {
  backgroundColor: '#FFF',
  padding: 25,
  alignItems: 'center',
  borderRadius: 15,
},
portfolioIcon: {
  marginBottom: 20,
  backgroundColor: '#EBF2FA',
  padding: 15,
  borderRadius: 50,
  overflow: 'hidden',
},
portfolioTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 12,
  textAlign: 'center',
},
portfolioDescription: {
  fontSize: 16,
  color: '#666',
  textAlign: 'center',
  marginBottom: 25,
  lineHeight: 22,
},
portfolioButton: {
  backgroundColor: '#4A6572',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 10,
  elevation: 2,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
},
portfolioButtonText: {
  color: '#FFF',
  fontWeight: '600',
  fontSize: 16,
},
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  padding: 10,
  zIndex: 10,
},
  
  // User section (Famous Experts)
  userSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 15,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  expertCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    width: width * 0.7,
    maxWidth: 250,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  expertImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4A6572',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  expertField: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  expertRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  expertVerified: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
  },
  bookButton: {
    backgroundColor: '#4A6572',
    width: '100%',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  noExpertsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noExpertsText: {
    fontSize: 14,
    color: '#666',
  },
  
  // How It Works Section
  howItWorksSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepsContainer: {
    flexDirection: 'column',
  },
  stepCard: {
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A6572',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Testimonial Section
  testimonialSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    margin: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testimonialCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 15,
    width: width * 0.75,
    maxWidth: 280,
    marginRight: 15,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A6572',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  testimonialInitial: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  testimonialText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  testimonialRating: {
    flexDirection: 'row',
  },
  
  // Support Section
  supportSection: {
    backgroundColor: '#4A6572',
    borderRadius: 15,
    margin: 15,
    padding: 20,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  supportText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#4A6572',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default homeStyles;