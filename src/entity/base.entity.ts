import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class SharedEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        type: "bigint",
        name: "id",
        comment: "主键id",
    })
    id!: number;

    @CreateDateColumn({
        type: "timestamp",
        nullable: false,
        name: "create_time",
        comment: "创建时间",
    })
    createTime!: Date;

    @UpdateDateColumn({
        type: "timestamp",
        nullable: false,
        name: "update_time",
        comment: "更新时间",
    })
    updateTime!: Date;
}
