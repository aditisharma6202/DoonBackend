module.exports = (sequelize, DataTypes) => {
    const CartItems = sequelize.define(
      'CartItems',
      {
        CartItems_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        total_price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
     
      },
      {
        tableName: 'cart_items',
      }
    );
  
    return CartItems;
  };