import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";

export default class PermissionApi extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public master_type_id

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setId(PermissionApi: PermissionApi) {
    PermissionApi.id = uuidv4();
  }
}
