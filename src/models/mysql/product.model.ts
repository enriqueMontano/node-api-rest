import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/dbs.config";

class Product extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: string;
  public price!: number;
  public userId!: number;

  static associate(models: any) {
    Product.belongsTo(models.User, { foreignKey: "userId", as: "owner" });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Product",
    timestamps: true,
  }
);

export default Product;
