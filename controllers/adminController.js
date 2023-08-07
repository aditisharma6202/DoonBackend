// const admin = require('firebase-admin');
// const credential = require('..silkecommerce-firebase-adminsdk-6cntj-8ae58e346f.json')
// admin.initializeApp({
//     credential: admin.credential.cert(credential)
//   });

var db = require('../models/index')
var Admin = db.admin
var userProfile = db.userProfile
var product = db.product
var productVariant = db.productVariant





// const {validationResult} = require('express-validator')


// const sendMail = require('../helper/sendMail')
const randomstring = require('randomstring');

const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env


  const generateToken = (userId) => {
    try {
      const token = jwt.sign({ id:userId}, process.env.JWT_SECRET, { expiresIn: '50h' });
      return token;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to generate token');
    }
  };
const saltRounds = 10; 



  const Admin_signup = async (req, res) => {
    try {
      const { name, password } = req.body;

      // Hash the password before storing it in the database
      // const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await Admin.create({ name, password: password });

      res.status(201).json({ message: 'Admin created successfully.', data: admin });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: 'Error creating admin.' });
    }
  };


  const Admin_login = async (req, res) => {
    try {
      const { name, password } = req.body;
      const admin = await Admin.findOne({ where: { name } });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      if (password !== admin.password) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
      // Create a JWT token and send it to the client upon successful login
      const token = generateToken(admin.admin_id); // Change this according to your token generation logic
  
      // Update the user's token in the database
      admin.token = token; 
      res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in.' });
    }
  };


  const getAllUsers = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await userProfile.findAll();
  
      return res.status(200).json({ message: 'Users retrieved successfully.', data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Error getting users.' });
    }
  };

  const getUsersByMonth = async (req, res) => {
    try {
      const month = req.params.month; // Assuming you pass the month as a URL parameter "month"
  
      // Fetch users with a profile_created_month value matching the provided month
      const users = await userProfile.findAll({
        where: {
          profile_created_month: month,
        },
      });
  
      return res.status(200).json({ message: 'Users retrieved successfully.', data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Error getting users.' });
    }
  };



  const addProductWithVariants = async (req, res) => {
    try {
      const { name, description, category_id, price, discount_percentage, variants } = req.body;
  
      // Create the main product
      const newProduct = await product.create({
        name,
        description,
        category_id,
        price,
        discount_percentage,
      });
  
      // Create variants for the product
      for (const variantData of variants) {
        const { size, color, quantity, variant_price } = variantData;
  
        const newVariant = await productVariant.create({
          product_id: newProduct.product_id,
          size,
          color,
        });
  
   
      }
  
      res.status(201).json({ message: 'Product with variants added successfully.',data:newProduct });
    } catch (error) {
      console.error('Error adding product with variants:', error);
      res.status(500).json({ message: 'Error adding product with variants.' });
    }
  };

  module.exports ={Admin_signup,Admin_login,getAllUsers,getUsersByMonth,addProductWithVariants}