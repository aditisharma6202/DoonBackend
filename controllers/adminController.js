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



const updatePassword = async (req, res) => {
  try {
    const { id, oldPassword, newPassword } = req.body;

    // Check if the user with the provided ID exists
    const user = await userProfile.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided old password with the stored password
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Incorrect old password.' });
    }

    // Update the user's password
    await userProfile.update(
      { password: newPassword },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password.' });
  }
};


  // const getUsersByMonth = async (req, res) => {
  //   try {
  //     const month = req.params.month; // Assuming you pass the month as a URL parameter "month"
  
  //     // Fetch users with a profile_created_month value matching the provided month
  //     const users = await userProfile.findAll({
  //       where: {
  //         profile_created_month: month,
  //       },
  //     });
  
  //     return res.status(200).json({ message: 'Users retrieved successfully.', data: users });
  //   } catch (error) {
  //     console.error('Error getting users:', error);
  //     res.status(500).json({ message: 'Error getting users.' });
  //   }
  // };



  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  
  //     // Create variants for the product
  //     for (const variantData of variants) {
  //       const { size, color, quantity, variant_price } = variantData;
  
  //       const newVariant = await productVariant.create({
  //         product_id: newProduct.product_id,
  //         size,
  //         color,
  //       });
  
   
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.',data:newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };



  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  //     console.log(name);
  //     console.log(price);
  //     console.log(category_id);

  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  
  //     // Create variants for the product
  //     for (const variantData of variants) {
  //       const { size, color, } = variantData;
  //       // const image = req.file.filename
  
  //       const newVariant = await productVariant.create({
  //         product_id: newProduct.product_id,
  //         size,
  //         color,
  //       });
  
  //       // Add images for the variant
  //       const variantImages = req.files[`variants[${variants.indexOf(variantData)}][image]`];
  //       if (variantImages) {
  //         for (const image of variantImages) {
  //           await variantPhoto.create({
  //             variant_id: newVariant.variant_id,
  //             image: image.filename,
  //           });
  //         }
  //       }
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };


  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  //     console.log(name);
  //     console.log(price);
  //     console.log(category_id);
  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  //     const mainProductId = newProduct.product_id; // Store the product_id
  //  // Create variants for the product
  //     for (const variantData of variants) {
  //       const { size, color } = variantData;
  
  //       const newVariant = await productVariant.create({
          
  //         product_id: mainProductId, // Use the stored product_id
  //         size,
  //         color,
  //       });
  
  //       // Add images for the variant
  //       const variantImages = req.files; // Multer already processes the files and attaches them to req.files
  //       console.log(variantImages);
  //       if (variantImages && variantImages.length > 0) {
  //         for (const image of variantImages) {
  //           await productVariant.create({
  //             variant_id: newVariant.variant_id,

  //             image: image.filename,
  //           });
  //         }
  //       }
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };















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
  
      const mainProductId = newProduct.product_id;
  
      // Create variants for the product
      for (const variantData of variants) {
        const { size, color, images } = variantData;
  
        // Create variant
        const newVariant = await productVariant.create({
          product_id: mainProductId,
          size,
          color,
        });
  
        // Add images for the variant
        if (images && images.length > 0) {
          for (const image of images) {
            await productVariant.create({
              product_id: mainProductId,
              variant_id: newVariant.variant_id, // Associate the image with the correct variant
              image: image.path, // Save the image file path to the database
            });
          }
        }
      }
  
      res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
    } catch (error) {
      console.error('Error adding product with variants:', error);
      res.status(500).json({ message: 'Error adding product with variants.' });
    }
  };







  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  
  //     const mainProductId = newProduct.product_id;
  
  //     // Create variants for the product
  //     for (let i = 0; i < variants.length; i++) {
  //       const variantData = variants[i];
  //       const { size, color, images } = variantData;
  
  //       const newVariant = await productVariant.create({
  //         product_id: mainProductId,
  //         size,
  //         color,
  //       });
  
  //       // Add images for the variant
  //       if (images && images.length > 0) {
  //         for (const image of images) {
  //           await productVariant.create({
  //             product_id: mainProductId,
  //             variant_id: newVariant.variant_id, // Associate the image with the correct variant
  //             image: image, // Save the image file path to the database
  //           });
  //         }
  //       }
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };






  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  
  //     const mainProductId = newProduct.product_id;
  
  //     // Create variants for the product
  //     for (const variantData of variants) {
  //       const { color } = variantData;
  
  //       const newVariant = await productVariant.create({
  //         product_id: mainProductId,
  //         color,
  //       });
  
  //       // Add images for the variant
  //       const variantImages = req.files[`variants[${variants.indexOf(variantData)}][images]`]; // Use the correct field name
  //       if (variantImages && variantImages.length > 0) {
  //         for (const image of variantImages) {
  //           await productVariant.create({
  //             // variant_id: newVariant.variant_id,
  //             image: image.filename,
  //           });
  //         }
  //       }
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };



  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  
  //     const mainProductId = newProduct.product_id;
  
  //     // Create variants for the product
  //     for (const variantData of variants) {
  //       const { color } = variantData;
  
  //       const newVariant = await productVariant.create({
  //         product_id: mainProductId,
  //         color,
  //       });
  
  //       // Add images for the variant
  //       const variantImages = req.files[`variants[${variants.indexOf(variantData)}][images]`];
  //       if (variantImages && variantImages.length > 0) {
  //         for (const image of variantImages) {
  //           console.log(image.path); // Check if the path is correct
  //           await productVariant.create({
  //             product_id: mainProductId,
  //             image: image.path, // Save the image file path to the database
  //           });
  //         }
  //       }
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };
  


  // const addProductWithVariants = async (req, res) => {
  //   try {
  //     const { name, description, category_id, price, discount_percentage, variants } = req.body;
  
  //     // Create the main product
  //     const newProduct = await product.create({
  //       name,
  //       description,
  //       category_id,
  //       price,
  //       discount_percentage,
  //     });
  
  //     const mainProductId = newProduct.product_id;
  
  //     // Create variants for the product
  //     for (const variantData of variants) {
  //       const { color } = variantData;
  //       const { images } = variantData;

  
  //       const newVariant = await productVariant.create({
  //         product_id: mainProductId,
  //         color,
  //       });
  // console.log(images);
  //       // Add images for the variant
  //       if (variantData.images && variantData.images.length > 0) {
  //         for (const image of variantData.images) {
  //           await productVariant.create({
  //             product_id: mainProductId,
  //             image: image, // Save the image file path to the database
  //           });
  //         }
  //       }
  //     }
  
  //     res.status(201).json({ message: 'Product with variants added successfully.', data: newProduct });
  //   } catch (error) {
  //     console.error('Error adding product with variants:', error);
  //     res.status(500).json({ message: 'Error adding product with variants.' });
  //   }
  // };

  module.exports ={Admin_signup,Admin_login,getAllUsers,getUsersByMonth,addProductWithVariants}