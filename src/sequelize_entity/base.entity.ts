import { Column, CreatedAt, DataType, Model, PrimaryKey, UpdatedAt } from "sequelize-typescript";

export class SharedEntity extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    field: "id"
  })
  id!: number;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: "create_time"
  })
  createTime!: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "update_time"
  })
  updateTime!: Date;


}
