import { Column, Entity } from "typeorm";
import { SharedEntity } from "./base.entity";

@Entity("test1")
export class Test1Entity extends SharedEntity {

  @Column({
    type: "varchar",
    length: 100,
    name: "name",
    comment: "名称",
    nullable: false
  })
  name!: string;

}
