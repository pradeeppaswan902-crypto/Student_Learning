import axios from 'axios';

const testSubmission = async () => {
  try {
    // First, login to get token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'rahul@gmail.com',
      password: '123456'
    });

    const token = loginResponse.data.token;
    console.log('Token:', token);

    // Get assignments
    const assignmentsResponse = await axios.get('http://localhost:5000/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Assignments:', assignmentsResponse.data);

    if (assignmentsResponse.data.length > 0) {
      const assignmentId = assignmentsResponse.data[0]._id;
      console.log('Submitting to assignment:', assignmentId);

      // Submit assignment
      const submitResponse = await axios.post(
        `http://localhost:5000/api/assignments/${assignmentId}/submit`,
        {
          submissionType: 'text',
          content: 'Test submission content'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Submission response:', submitResponse.data);
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testSubmission();