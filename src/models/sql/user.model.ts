import {
  Model,
  Column,
  Table,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { IUser, IUserCreate, UserRoles } from "../../interfaces";
import Product from "./product.model";

@Table({ tableName: "users", modelName: "User", timestamps: true })
export default class User extends Model<IUser, IUserCreate> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  name!: string;

  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  email!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  password!: string;

  @Column({
    allowNull: false,
    type: DataType.JSON,
    values: Object.values(UserRoles),
    defaultValue: [UserRoles.User],
  })
  roles!: UserRoles[];

  @HasMany(() => Product)
  products!: Product[];

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;
}
