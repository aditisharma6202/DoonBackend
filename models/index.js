const { Sequelize,DataTypes } = require('sequelize');

// const sequelize = new Sequelize('sql6636217', 'sql6636217', 'qsIXCR9U5q', {
//   host: 'sql6.freesqldatabase.com',
//   logging:false,
//   dialect: 'mysql',
// });\

<<<<<<< Updated upstream
// const sequelize = new Sequelize('silkecommerce', 'root', 'cprakhar999@gmail.com', {
//   host: 'localhost',
//   logging:false,
//   dialect: 'mysql',
//   // operatorsAliases: false,

// });

const sequelize = new Sequelize('silkecommerce', 'doonsilk', '7yT&9s9JszVj', {
=======
const sequelize = new Sequelize('silkecommerce', 'root', 'aditi@6202', {
>>>>>>> Stashed changes
  host: 'localhost',
  logging:false,
  dialect: 'mysql',
  // operatorsAliases: false,

});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  
  const db = {}
  db.Sequelize=Sequelize
  db.sequelize = sequelize
  db.category = require('./category')(sequelize,DataTypes)
  db.admin = require('./adminProfile')(sequelize,DataTypes)
  db.userProfile = require('./userProfile')(sequelize,DataTypes)
  db.cartItem = require('./cartItem')(sequelize,DataTypes)

  db.main_product = require('./newProduct')(sequelize,DataTypes)
  db.new_varient = require('./new_varient')(sequelize,DataTypes)


  db.tenderForm = require('./tenderForm')(sequelize,DataTypes)
  db.banner = require('./banner')(sequelize,DataTypes)


  













  // db.category.hasMany( db.product,{foreignKey:'category_id'})
  // db.product.belongsTo(db.category,{ foreignKey: 'category_id' })


  db.userProfile.hasMany( db.cartItem,{foreignKey:'user_id'})
  db.cartItem.belongsTo(db.userProfile,{ foreignKey: 'user_id' })





  db.category.hasMany( db.main_product,{foreignKey:'category_id'})
  db.main_product.belongsTo(db.category,{ foreignKey: 'category_id' })

  db.main_product.hasMany( db.new_varient,{foreignKey:'product_id'})
  db.new_varient.belongsTo(db.main_product,{ foreignKey: 'product_id' })

  db.main_product.hasMany( db.cartItem,{foreignKey:'product_id'})
  db.cartItem.belongsTo(db.main_product,{ foreignKey: 'product_id' })


  sequelize.sync({force:false})
  module.exports = db