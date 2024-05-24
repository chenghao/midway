import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class SharedEntity extends Model {
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        field: "id",
        autoIncrement: true,
    })
    id!: number;

    // 全局 timestamps: false 时取消 CreatedAt 并取消 DataType.DATE
    //@CreatedAt
    @Column({
        // type: DataType.DATE,
        field: "create_time",
    })
    createTime!: Date;

    // 全局 timestamps: false 时取消 UpdatedAt 并取消 DataType.DATE
    //@UpdatedAt
    @Column({
        // type: DataType.DATE,
        field: "update_time",
    })
    updateTime!: Date;
}
