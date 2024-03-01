import { SharedEntity } from "./base.entity";
import { Entity, Property } from "@mikro-orm/core";

@Entity({ tableName: "test1" })
export class Test1Entity extends SharedEntity {

  @Property({
    fieldName: "name",
    type: "string"
  })
  name!: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
