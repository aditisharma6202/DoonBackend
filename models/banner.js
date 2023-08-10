module.exports = (sequelize, DataTypes) => {
    const banner = sequelize.define('banner_', {
      image1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },{
      tableName: 'banner_'
    });
  
    return banner;
  };
  