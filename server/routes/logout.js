import express from 'express';
// No external models required for logout route

const router = express.Router();

router.post('/', (req, res) => {
  // Clear the user session or authentication token
  try{
    res.clearCookie('taskflow_token', {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: 'lax'
    });
    return res.json({ message: 'Logout successful' });

  } catch (error){
    return res.status(500).json({ message: 'Error clearing cookie', error: error.message });
  }
  

});
export default () => router;