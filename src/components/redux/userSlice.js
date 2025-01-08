import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    form: {
      user: {
        id: null,
        name: '',
        phone: '',
        email: '',
        marks1: '',
        marks2: '',
        marks3: '',
      },
      errors: {
        name: '',
        phone: '',
        email: '',
        marks1: '',
        marks2: '',
        marks3: '',
      },
      isSubmitting: false,
    },
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    setFormUser: (state, action) => {
      state.form.user = { ...state.form.user, ...action.payload };
    }, 
    setSubmitting: (state, action) => {
      state.form.isSubmitting = action.payload;
    },
  
    validateField: (state, action) => {
      const { field, value } = action.payload;
      let message = '';
    
      // Validate name (only alphabets and spaces, no numbers or special characters)
      if (field === 'name' && !/^[A-Za-z\s]+$/.test(value)) {
        message = 'Name must contain only alphabets and spaces.';
      }
    
      // Validate phone (must be exactly 10 digits)
      if (field === 'phone' && !/^\d{10}$/.test(value)) {
        message = 'Phone number must be 10 digits.';
      }
    
      // Validate email (valid email format)
      if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        message = 'Please enter a valid email.';
      }
    
      // Validate marks (must be a number between 1 and 100)
      if (field === 'marks1' && (value < 1 || value > 100 || isNaN(value))) {
        message = 'Marks must be between 1 and 100.';
      }
      if (field === 'marks2' && (value < 1 || value > 100 || isNaN(value))) {
        message = 'Marks must be between 1 and 100.';
      }
      if (field === 'marks3' && (value < 1 || value > 100 || isNaN(value))) {
        message = 'Marks must be between 1 and 100.';
      }
    
      // Set the error for the specific field
      state.form.errors[field] = message;
    }
    
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setFormUser,
  setSubmitting,
  validateField,
} = userSlice.actions;

export default userSlice.reducer;
