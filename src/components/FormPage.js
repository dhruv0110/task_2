import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFormUser, setSubmitting, addUser, updateUser } from './redux/userSlice';
import { Field, reduxForm } from 'redux-form';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Higher Order Component to handle routing params and navigation
const withParamsAndNavigate = (Component) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
};

class FormPage extends Component {
  componentDidMount() {
    const { params, dispatch } = this.props;
    const { id } = params;
    
    if (id) {
      // Fetch user data when editing an existing user
      this.fetchUserData(id);
    }
    dispatch(setSubmitting(false));
  }

  // Fetch user data from API
  fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      const fetchedUser = response.data;
      console.log('Fetched user:', fetchedUser);
      this.props.dispatch(setFormUser(fetchedUser));  // Set user data in Redux state
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Handle form submission
  handleSubmit = async (formValues) => {
    const { dispatch, navigate } = this.props;

    try {
      if (formValues.id) {
        // Update existing user
        await axios.patch(`http://localhost:5000/users/${formValues.id}`, formValues);
        dispatch(updateUser(formValues));  // Update user in Redux
      } else {
        // Add new user
        const response = await axios.post('http://localhost:5000/users', formValues);
        dispatch(addUser(response.data));  // Add new user to Redux
      }
      navigate('/');  // Navigate back to the user list page
    } catch (error) {
      console.error('Error submitting user:', error);
    }
  };

  // Custom render method for TextField
  renderTextField = ({ input, label, meta: { touched, error } }) => (
    <Box mb={2}>
      <TextField
        {...input}  // Spread the input properties to connect redux-form to the field
        label={label}
        variant="outlined"
        fullWidth
        error={touched && !!error}
        helperText={touched && error}
      />
    </Box>
  );

  render() {
    const { handleSubmit, isSubmitting } = this.props;

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {this.props.params.id ? 'Edit User' : 'Create User'}
        </Typography>
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field name="name" label="Name" component={this.renderTextField} />
          <Field name="phone" label="Phone" component={this.renderTextField} />
          <Field name="email" label="Email" component={this.renderTextField} />
          <Field name="marks1" label="Marks 1" component={this.renderTextField} />
          <Field name="marks2" label="Marks 2" component={this.renderTextField} />
          <Field name="marks3" label="Marks 3" component={this.renderTextField} />
          <Box textAlign="center">
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.form.user,
  isSubmitting: state.users.form.isSubmitting,
  initialValues: state.users.form.user,  // Ensure initial values are from Redux state
});

const formWrapped = reduxForm({
  form: 'userForm',
  enableReinitialize: true,  // Ensure re-initialization when form values change
})(FormPage);

export default withParamsAndNavigate(connect(mapStateToProps)(formWrapped));
