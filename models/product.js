module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
      'Product',
      {
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
       
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
          },

        discount: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
        },
        any_festival_discount: {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0,
          },
        discountPrice: {
            type: DataTypes.FLOAT,
            allowNull: true,
          },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        colour: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        size: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        information: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        is_featured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        is_available: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        image: {
          type: DataTypes.STRING, // Store the URL or path of the image
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: 'products',
        timestamps: false,
      }
    );
  
    return Product;
  };











  