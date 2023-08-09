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
var variantImages = db.variantImages
var main_product = db.main_product
var category = db.category
var new_varient = db.new_varient
var tender = db.tender
var notice = db.notice
var announcement = db.announcement
var tenderForm = db.tenderForm













const sequelize = require('sequelize');

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




  const { Op } = require('sequelize');

const getUsersByMonth = async (req, res) => {
  try {
    const { year, month } = req.body; // Assuming you send the year and month in the request body

    // Count the number of users created in the specified year and month
    const userCount = await userProfile.count({
      where: {
        createdAt: {
          [Op.and]: [
            sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), year),
            sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), month),
          ],
        },
      },
    });

    return res.status(200).json({ message: 'User count retrieved successfully.', count: userCount });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ message: 'Error getting user count.' });
  }
};

  
  
const addProductWithVariants = async (req, res) => {
  try {
    const { name, description, category_id, price, discount_percentage, size, color,color_hex } = req.body;
    const images = req.files;

    // Check if the provided category_id exists in the description table
    const existingDescription = await db.category.findOne({
      where: {
        category_id: category_id,
      },
    });

    if (!existingDescription) {
      return res.status(400).json({ message: 'Invalid category_id. category not found.' });
    }

    // Create the main product
    const newProduct = await db.main_product.create({
      name,
      description,
      category_id,
      price,
      discount_percentage,
      size,
      color,
      image1: images['image1'][0].filename,
      image2: images['image2'][0].filename,
      image3: images['image3'][0].filename,
      color_hex

    });

    res.status(201).json({ message: 'Main product added successfully.', data: newProduct });
  } catch (error) {
    console.error('Error adding main product:', error);
    res.status(500).json({ message: 'Error adding main product.' });
  }
};


const addVariant = async (req, res) => {
  try {
    const { product_id, color, size ,color_hex} = req.body;
    const images = req.files;

    // Check if the provided product_id exists in the main_product table
    const existingProduct = await db.main_product.findByPk(product_id);

    if (!existingProduct) {
      return res.status(400).json({ message: 'Invalid product_id. Main product not found.' });
    }

    // Create the variant
    const newVariant = await db.new_varient.create({
      product_id,
      color,
      size,
      image1: images['image1'][0].filename,
      image2: images['image2'][0].filename,
      image3: images['image3'][0].filename,
      color_hex

    });

    res.status(201).json({ message: 'Variant added successfully.', data: newVariant });
  } catch (error) {
    console.error('Error adding variant:', error);
    res.status(500).json({ message: 'Error adding variant.' });
  }
};


const updateMainProduct = async (req, res) => {
  try {
    const { product_id } = req.body;
    const { name, description, category_id, price, discount_percentage, size, color } = req.body;
    const images = req.files;

    const updatedFields = {
      name,
      description,
      category_id,
      price,
      discount_percentage,
      size,
      color,
    };

    // Update image fields if images are provided
    if (images) {
      updatedFields.image1 = images['image1'][0].filename;
      updatedFields.image2 = images['image2'][0].filename;
      updatedFields.image3 = images['image3'][0].filename;
    }

    const [affectedRows] = await db.main_product.update(updatedFields, {
      where: {
        product_id: product_id,
      },
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Main product not found.' });
    }

    res.status(200).json({ message: 'Main product updated successfully.' });
  } catch (error) {
    console.error('Error updating main product:', error);
    res.status(500).json({ message: 'Error updating main product.' });
  }
};
const getMainProductById = async (req, res) => {
  try {
    const { product_id } = req.body;

    // Find the main product by product_id along with its variants
    const mainProduct = await db.main_product.findOne({
      where: {
        product_id: product_id,
      },
      include: {
        model: db.new_varient, // Assuming your variant model is named "variant"
        where: {
          product_id: product_id,
        },
      },
    });

    if (!mainProduct) {
      return res.status(404).json({ message: 'Main product not found.' });
    }

    res.status(200).json({ data: mainProduct });
  } catch (error) {
    console.error('Error fetching main product:', error);
    res.status(500).json({ message: 'Error fetching main product.' });
  }
};


const deleteMainProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    const deletedProduct = await db.main_product.destroy({
      where: {
        product_id: product_id,
      },
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Main product not found.' });
    }

    res.status(200).json({ message: 'Main product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting main product:', error);
    res.status(500).json({ message: 'Error deleting main product.' });
  }
};


const getVariantById = async (req, res) => {
  try {
    const { variant_id } = req.body;

    const variant = await db.new_varient.findByPk(variant_id);

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    res.status(200).json({ data: variant });
  } catch (error) {
    console.error('Error fetching variant:', error);
    res.status(500).json({ message: 'Error fetching variant.' });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const { variant_id } = req.body;

    const deletedVariant = await db.new_varient.destroy({
      where: {
        variant_id: variant_id,
      },
    });

    if (!deletedVariant) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    res.status(200).json({ message: 'Variant deleted successfully.' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    res.status(500).json({ message: 'Error deleting variant.' });
  }
};

const updateVariant = async (req, res) => {
  try {
    const { variant_id } = req.body;
    const { color, size } = req.body;
    const images = req.files;

    // Find the variant by variant_id
    const existingVariant = await db.new_varient.findOne({
      where: {
        variant_id: variant_id,
      },
    });

    if (!existingVariant) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    // Update variant details
    const updatedVariant = await db.new_varient.update(
      {
        color,
        size,
      },
      {
        where: {
          variant_id: variant_id,
        },
      }
    );

    // Update variant images if provided
    if (images) {
      await db.new_varient.update(
        {
          image1: images['image1'][0].filename,
          image2: images['image2'][0].filename,
          image3: images['image3'][0].filename,
        },
        {
          where: {
            variant_id: variant_id,
          },
        }
      );
    }

    res.status(200).json({ message: 'Variant updated successfully.' });
  } catch (error) {
    console.error('Error updating variant:', error);
    res.status(500).json({ message: 'Error updating variant.' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await db.main_product.findAll(); 

    res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products.' });
  }
};





const addTenderForm = async (req, res) => {
  try {
    const { criteria, datatype, is_active, text } = req.body;

    // Handle file upload using Multer
      

      const file = req.file.filename

      // Create a new announcement entry in the database
      const newAnnouncement = await db.tenderForm.create({
        criteria,
        datatype,
        is_active,
        file: file,
        text,
      });

      res.status(201).json({ message: 'Announcement added successfully.', data: newAnnouncement });
    
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ message: 'Error adding announcement.' });
  }
};






  module.exports ={Admin_signup,Admin_login,getAllUsers,getUsersByMonth,addProductWithVariants,addVariant,updateMainProduct,
    getMainProductById,deleteMainProduct,getVariantById,deleteVariant,updateVariant,getAllProducts,addTenderForm}