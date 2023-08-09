module.exports = (sequelize, DataTypes) => {
    const notice_ = sequelize.define('notice_', {
      value: {
        type: DataTypes.INTEGER, // Use INTEGER for integer values
        allowNull: false,
      },
      input: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN, // Use BOOLEAN for true/false values
        allowNull: false,
        defaultValue: true, // Set a default value if needed
      },
    },{
        tableName: 'notice_',

    });
  
    return notice_;
  };