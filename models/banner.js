module.exports = (sequelize, DataTypes) => {
    const banner = sequelize.define('banner', {

      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     
    },{
        tableName: 'banner'
      });
  
    return banner;
  };
  