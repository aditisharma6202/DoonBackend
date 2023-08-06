const { Sequelize,DataTypes } = require('sequelize');

// const sequelize = new Sequelize('sql6636217', 'sql6636217', 'qsIXCR9U5q', {
//   host: 'sql6.freesqldatabase.com',
//   logging:false,
//   dialect: 'mysql',
// });\

const sequelize = new Sequelize('silkecommerce', 'root', 'cprakhar999@gmail.com', {
  host: 'localhost',
  logging:false,
  dialect: 'mysql',
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
  db.product = require('./product')(sequelize,DataTypes)
  db.admin = require('./adminProfile')(sequelize,DataTypes)
  db.userProfile = require('./userProfile')(sequelize,DataTypes)




  db.category.hasMany( db.product,{foreignKey:'category_id'})
  db.product.belongsTo(db.category,{ foreignKey: 'category_id' })

  sequelize.sync({force:false})
  module.exports = db