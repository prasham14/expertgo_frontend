import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginLeft: 10,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A6572',
  },
  howItWorksSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#F0F0F2',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom:30,
    border : ''
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },

  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  stepCard: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4267b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  testimonialSection: {
    paddingVertical: 25,
    marginHorizontal: 20,
  },
  testimonialCard: {
    width: width * 0.75,
    backgroundColor: '#F0F0F2',
    borderRadius: 20,
    padding: 20,
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
    backgroundColor: '#4267b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  testimonialInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F0F2',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  testimonialText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 10,
  },
  testimonialRating: {
    flexDirection: 'row',
    marginTop: 5,
  },
  supportSection: {
    backgroundColor: '#4A6572',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    marginVertical: 25,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  supportText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: '#83C5BE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  portfolioContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  portfolioIcon: {
    marginBottom: 15,
  },
  portfolioTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  portfolioDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  portfolioButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  portfolioButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#F0F0F2',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    position: 'relative',
    minHeight: 120,
  },
  categoryDark: {
    backgroundColor: '#333333',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 5,
  },
  categoryTitleDark: {
    color: '#FFFFFF',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  categoryDescriptionDark: {
    color: '#CCCCCC',
  },
  categoryButton: {
    backgroundColor: '#4267b2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    backgroundColor: '#F0F0F2',
    marginHorizontal: 20,
    marginTop: 20,

  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    fontWeight: '400',
  },
  specialSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  specialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  specialTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    letterSpacing: 0.3,
  },
  seeAllText: {
    fontSize: 15,
    color: '#4267b2',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  expertCard: {
    backgroundColor: '#E8F8F7',
    borderRadius: 20,
    padding: 25,
    marginRight: 15,
    width: width * 0.8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
   
  },
  expertName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  expertSpeciality: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 15,
    fontWeight: '500',
  },
  expertMeta: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingTop: 5,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  metaText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 6,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#10B981',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignSelf: 'flex-start',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,

  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItemActive: {
    backgroundColor: '#E8F8F7',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  tabTextActive: {
    color: '#333333',
    fontWeight: '500',
  },
  bankPromptContainer: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  bankPromptText: {
    color: '#92400E',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },

  bankPromptButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  bankPromptButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  // Enhanced category styles
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginTop: 10,
  },

  // Enhanced testimonial styles with better spacing and colors
  testimonialSection: {
    paddingVertical: 30,
    marginHorizontal: 20,
    marginTop: 10,
  },

  testimonialCard: {
    width: width * 0.75,
    backgroundColor: '#F0F0F2',
    borderRadius: 25,
    padding: 25,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F2',
  },

  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  testimonialAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#4267b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4267b2',
    shadowOffset: { width: 0, height: 2 },
  },

  testimonialInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  testimonialName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333333',
    letterSpacing: 0.3,
  },

  testimonialText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 15,
    fontStyle: 'italic',
    fontWeight: '400',
  },

  testimonialRating: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-start',
  },

  // Enhanced support section
  supportSection: {
    background: '#F0F0F2',
    backgroundColor: '#F0F0F2',
    borderRadius: 25,
    padding: 30,
    marginHorizontal: 20,
    marginVertical: 30,
    shadowColor: '#4A6572',

  },

  supportTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  supportText: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '400',
  },

  supportButton: {
    backgroundColor: '#4267b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignSelf: 'flex-start',
   
  },

  supportButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.5,
  },

  // Enhanced how it works section
  howItWorksSection: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: '#F0F0F2',
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
    shadowColor: '#000',
 
    borderWidth: 1,
    borderColor: '#F0F0F2',
  },

  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  stepCard: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 15,
  },

  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4267b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4267b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  stepNumberText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  stepDescription: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '400',
  },

  welcomeSection: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: '#F0F0F2',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    shadowColor: '#000',

    borderWidth: 1,
    borderColor: '#E8F8F7',
    position: 'relative',
    overflow: 'hidden',
  },

  welcomeText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#333333',
    marginBottom: 10,
    letterSpacing: 0.8,
    textAlign: 'left',
  },

  welcomeSubtext: {
    fontSize: 17,
    color: '#666666',
    lineHeight: 26,
    fontWeight: '500',
    textAlign: 'left',
  },

  // Enhanced modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },

  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  portfolioContainer: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 10,
  },

  portfolioIcon: {
    marginBottom: 20,
  },

  portfolioTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  portfolioDescription: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 26,
    fontWeight: '400',
  },

  portfolioButton: {
    backgroundColor: '#4267B2',
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#4267B2',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },

  portfolioButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default homeStyles;