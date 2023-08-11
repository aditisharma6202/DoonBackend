module.exports = (sequelize, DataTypes) => {
    const WishlistItem = sequelize.define('WishlistItem', {
      wishlist_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },{
        tableName: 'WishlistItem',
        timestamps: true,
      });
    
  return WishlistItem;
};