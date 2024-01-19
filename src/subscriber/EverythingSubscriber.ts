import { EventSubscriberModel } from "@midwayjs/typeorm";
import { EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";

@EventSubscriberModel()
export class EverythingSubscriber implements EntitySubscriberInterface {
  
  /**
   * Called before entity inserted.
   */
  beforeInsert(event: InsertEvent<any>) {
    console.log(`实体插入之前: `, event.entity);
  }

  /**
   * Called before entity updated.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    console.log(`实体更新之前: `, event.entity);
  }

  /**
   * Called before entity removed.
   */
  beforeRemove(event: RemoveEvent<any>) {
    console.log(`实体删除之前，ID ${event.entityId} : `, event.entity);
  }

  /**
   * Called after entity inserted.
   */
  afterInsert(event: InsertEvent<any>) {
    console.log(`实体插入之后: `, event.entity);
  }

  /**
   * Called after entity updated.
   */
  afterUpdate(event: UpdateEvent<any>) {
    console.log(`实体更新之后: `, event.entity);
  }

  /**
   * Called after entity removed.
   */
  afterRemove(event: RemoveEvent<any>) {
    console.log(`实体删除之后， ID ${event.entityId} : `, event.entity);
  }

  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: any) {
    console.log(`加载实体之后: `, entity);
  }

}
