import { DateTime } from "luxon";
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import PermissionApi from "App/Models/PermissionApi";

export default class PermissionUserApi extends BaseModel {
  public static table = 'permission_user_api'
  @column({ isPrimary: true })
  public id: string;

  @column()
  public permission_api_id: string;

  @column()
  public user_id: string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setId(PermissionUserApi: PermissionUserApi) {
    PermissionUserApi.id = uuidv4();
  }

  @belongsTo(() => PermissionApi, { foreignKey: "permission_api_id" })
  public permissionApi: BelongsTo<typeof PermissionApi>;
}
