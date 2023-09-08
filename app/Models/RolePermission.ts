import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Permission from "App/Models/Permission";

export default class RolePermission extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public role_id: string;

  @column()
  public permission_id: string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setId(RolePermission: RolePermission) {
    RolePermission.id = uuidv4();
  }

  @belongsTo(() => Permission,{foreignKey:'permission_id'})
  public permission: BelongsTo<typeof Permission>;
}
