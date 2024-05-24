import { PrimaryKey, Property } from "@mikro-orm/core";

export abstract class SharedEntity {
    @PrimaryKey()
    id!: number;

    @Property({
        fieldName: "create_time",
        columnType: "datetime",
        nullable: true,
    })
    createTime!: Date;

    @Property({
        fieldName: "update_time",
        columnType: "datetime",
        nullable: true,
    })
    updateTime!: Date;
}
