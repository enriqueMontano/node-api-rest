import {
  Model,
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { User } from "./index";
import { IProduct, IProductCreate } from "../../interfaces";

@Table({ tableName: "products", modelName: "Product", timestamps: true })
export default class Product extends Model<IProduct, IProductCreate> {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  name!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  description!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  category!: string;

  @Column({ allowNull: false, type: DataType.FLOAT })
  price!: number;

  @ForeignKey(() => User)
  @Column({ allowNull: false, type: DataType.UUID })
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

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
