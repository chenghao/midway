import { SharedEntity } from "./base.entity";
import { Column, DataType, Table } from "sequelize-typescript";

@Table({ tableName: "test1" })
export class Test1Entity extends SharedEntity {
    @Column(DataType.STRING)
    name!: string;
}
