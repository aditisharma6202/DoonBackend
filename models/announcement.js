module.exports = (sequelize, DataTypes) => {
    const announcement_ = sequelize.define('announcement_', {
      value: {
        type: DataTypes.INTEGER, // Use INTEGER for integer values
        allowNull: true,
      },
      input: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN, // Use BOOLEAN for true/false values
        allowNull: false,
        defaultValue: true, // Set a default value if needed
      },
    },{
        tableName: 'announcement_',

    });
  
    return announcement_;
  };