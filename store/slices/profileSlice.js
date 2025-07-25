// store/slices/profileSlice.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://expertgo-v1.onrender.com';

// Async thunks for API calls
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/getnameandemail/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchExpertProfile = createAsyncThunk(
  'profile/fetchExpertProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/expert/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProfileImage = createAsyncThunk(
  'profile/fetchProfileImage',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/images/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'profile/uploadProfileImage',
  async ({ userId, image }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.type,
      name: image.fileName,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/profile/upload/profile-image/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUsername = createAsyncThunk(
  'profile/updateUsername',
  async ({ userId, username }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/editUserName/${userId}`,
        { username }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBio = createAsyncThunk(
  'profile/updateBio',
  async ({ userId, bio }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/expert/bio/${userId}`,
        { bio }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleExpertAvailability = createAsyncThunk(
  'profile/toggleExpertAvailability',
  async ({ userId, isAvailable }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/expert/availability/${userId}`,
        { isAvailable }
      );
      return { isAvailable };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sendVerificationOTP = createAsyncThunk(
  'profile/sendVerificationOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const generatedOTP = otp || Math.floor(1000 + Math.random() * 9000);
      const response = await axios.get(`${BASE_URL}/profile/verify/${email}/${generatedOTP}`);
      return { ...response.data, otp: generatedOTP };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'profile/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/profile/verify-otp`, { 
        email, 
        otp 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateEmail = createAsyncThunk(
  'profile/updateEmail',
  async ({ userId, newEmail }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/profile/changeEmail/${userId}`,
        { newEmail }
      );
      return { email: newEmail };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const becomeExpert = createAsyncThunk(
  'profile/becomeExpert',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${BASE_URL}/profile/becomeExpert/${userId}`);
      await AsyncStorage.setItem('userRole','expert');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  userData: {},
  expertData: {
    bio: null,
    isAvailable: false,
    isVerified: false,
  },
  imageUrl: null,
  loading: false,
  error: null,
  emailVerification: {
    otp: null,
    showOtpInput: false,
    newEmail: '',
    loading: false,
    error: '',
  },
};

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setEmailVerificationState: (state, action) => {
      state.emailVerification = {
        ...state.emailVerification,
        ...action.payload,
      };
    },
    resetEmailVerificationState: (state) => {
      state.emailVerification = {
        otp: null,
        showOtpInput: false,
        newEmail: '',
        loading: false,
        error: '',
      };
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch expert profile
      .addCase(fetchExpertProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpertProfile.fulfilled, (state, action) => {
        state.expertData = {
          bio: action.payload.data.bio,
          isAvailable: action.payload.data.isAvailable || false,
          isVerified: action.payload.data.isVerified,
        };
        state.loading = false;
      })
      .addCase(fetchExpertProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch profile image
      .addCase(fetchProfileImage.fulfilled, (state, action) => {
        state.imageUrl = action.payload.imageUrl;
      })

      // Upload profile image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.imageUrl = action.payload.imageUrl;
        state.loading = false;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update username
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.userData.name = action.payload.user.name;
      })

      // Update bio
      .addCase(updateBio.fulfilled, (state, action) => {
        state.expertData.bio = action.meta.arg.bio;
      })

      // Toggle expert availability
      .addCase(toggleExpertAvailability.fulfilled, (state, action) => {
        state.expertData.isAvailable = action.payload.isAvailable;
      })

      // Send OTP
      .addCase(sendVerificationOTP.pending, (state) => {
        state.emailVerification.loading = true;
      })
      .addCase(sendVerificationOTP.fulfilled, (state, action) => {
        state.emailVerification.loading = false;
        state.emailVerification.showOtpInput = true;
        state.emailVerification.otp = action.payload.otp;
      })
      .addCase(sendVerificationOTP.rejected, (state, action) => {
        state.emailVerification.loading = false;
        state.emailVerification.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.emailVerification.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.emailVerification.loading = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.emailVerification.loading = false;
        state.emailVerification.error = action.payload;
      })

      // Update email
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.userData.email = action.payload.email;
      });
  },
});

export const { 
  setEmailVerificationState, 
  resetEmailVerificationState,
  resetError
} = profileSlice.actions;

export default profileSlice.reducer;