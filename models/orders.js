module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('UserOrder', {
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      CartItems_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, 
  {  tableName: 'UserOrder',
    timestamps: true});
  
    return Order;
  };