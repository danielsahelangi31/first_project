import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany
} from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Role from "App/Models/Role";
import PermissionUserApi from "App/Models/PermissionUserApi";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public role_id: string;

  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public user_api: number;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken?: string;

  @column()
  public token:string;

  @column()
  public email_notif:string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password);
    }
  }

  @beforeCreate()
  public static async setId(User: User) {
    User.id = uuidv4();
  }

  @belongsTo(() => Role, { foreignKey: "role_id" })
  public role: BelongsTo<typeof Role>;

  @hasMany(() => PermissionUserApi, { foreignKey: "user_id" })
  public permissionApi: HasMany<typeof PermissionUserApi>;
}
