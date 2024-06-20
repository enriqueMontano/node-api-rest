import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../configs/dbs.config";
import { UserRoles } from "../../interfaces";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public roles!: UserRoles[];
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [UserRoles.User],
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: true,
  }
);

export default User;
