

var db = require('../models/index')
// var category = db.category
var userProfile = db.userProfile
const { Op } = require('sequelize');
const {JWT_SECRET} = process.env
const jwt = require('jsonwebtoken')


const sendMail = require('../helper/sendMail')
const randomstring = require('randomstring');



const generateToken = (user_id) => {
  try {
    const token = jwt.sign({ user_id}, process.env.JWT_SECRET, { expiresIn: '50h' });
    return token;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate token');
  }
};
const saltRounds = 10; 



const signupUsers = async (req, res) => {
  const email = req.body.email;
  // Generate a 6-digit OTP
  const otp = randomstring.generate({ length: 6, charset: 'numeric' });

  // Create the email content with the OTP
  const mailSubject = 'OTP for Mail Verification';
  const content = `<p>Your OTP for mail verification is: ${otp}</p>`;

  try {
    // Send the email with the OTP
    await sendMail(email, mailSubject, content);

    // Save the user data with the OTP in the database
    const newUserData = await userProfile.create({
      email: email,
      OTP: otp // Save the OTP to the 'token' field
    });

    const id = newUserData.user_id;
    console.log('New user created:', newUserData.toJSON());
    res.status(201).json({ message: 'User created successfully.', id: id });
  } catch (error) {
    console.error('Error sending email or creating user:', error);
    res.status(500).json({ message: 'Error sending email or creating user.' });
  }
};


  const verifyOTP = (req, res) => {

   const  user_id = req.params.id
    const { otp } = req.body;
  
    userProfile.findOne({ where: { user_id } })
      .then((existingUser) => {
        if (!existingUser) {
          return res.status(404).json({ message: 'User not found.' });
        }
  
        if (existingUser.OTP === otp) {
      
          existingUser.update({ is_verified: true })
            .then(() => {
              return res.status(200).json({ message: 'OTP is valid. User verified successfully.' });
            })
            .catch((error) => {
              console.error('Error updating user:', error);
              return res.status(500).json({ message: 'Error updating user.' });
            });
        } else {
          return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
        }
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Error finding user.' });
      });
  };


  async function savePassword(req, res) {
    try {
      const { user_id } = req.body;
      const { password } = req.body;
      console.log(password);
  
      if (!password ) {
        return res.status(400).json({ error: 'Passwords not found' });
      }
  
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await userProfile.findByPk(user_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.password = password;
      await user.save();
  
      res.json({ message: 'Password saved successfully' });
    } catch (error) {
      console.error('Error saving password:', error);
      res.status(500).json({ error: 'Failed to save password' });
    }
  }
  


  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await userProfile.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if the user's email is verified
      if (!user.is_verified) {
        return res.status(401).json({ message: 'Email is not verified. Please verify your email first.' });
      }
  
      console.log(password);
      console.log(user.password);
      // Hash the provided password using SHA-256 (You should use a secure hashing algorithm like bcrypt for passwords)
  
      // Check if the provided password matches the user's hashed password
      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      // Generate a new token for the user (change this according to your token generation logic)
      const token = generateToken(user.user_id); // Change this according to your token generation logic
      console.log(user.user_id);
  
      // Update the user's token in the database
      user.token = token;
      await user.save(); // Save the updated user instance to the database
  
      res.status(200).json({ message: 'User logged in successfully.', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Error logging in user.' });
    }
  };
  

  const addUserDetails = async (req, res) => {
    try {
      // Check for the JWT token in the request header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
      }
  
      // Verify the token and get the user_id from the payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }
  
      // Check if the user exists in the database
      const existingUser = await userProfile.findOne({ where: { user_id: userId } });
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const { name, phone, password, address, pincode, gender } = req.body;
  
  
      // Update the user details in the database
      await userProfile.update(
        {
          name,
          phone,
          password,
          address,
          pincode,
          gender,
        },
        { where: { user_id: userId } }
      );
  
      // Respond with the updated user data
      const updatedUser = await userProfile.findByPk(userId);
      res.status(200).json({
        message: 'User details updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error adding user details:', error);
      res.status(500).json({ error: 'Failed to add user details' });
    }
  };

  const userLogout = (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.decode(token);
    const userid = decodedToken.user_id;
  
    // Remove token from user table in the database
    userProfile.update({ token: null }, { where: { user_id: userid } })
      .then(() => {
        res.status(200).json({ message: 'User logged out successfully.' });
      })
      .catch((error) => {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Error logging out user.' });
      });
  };
  
  

  module.exports = { signupUsers,verifyOTP,savePassword,addUserDetails,loginUser,userLogout};

