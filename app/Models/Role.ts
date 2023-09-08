import { DateTime } from "luxon";
import {
  BaseModel,
  beforeCreate,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany
} from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import RolePermission from "App/Models/RolePermission";
import Entity from "App/Models/Entity";
import EntityLocationView from "./EntityLocationView";


export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public entity_id: string;

  @column()
  public flag: number;

  @column()
  public portal_id: number;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setId(Role: Role) {
    Role.id = uuidv4();
  }

  @hasMany(() => RolePermission, { foreignKey: "role_id" })
  public permissionRole: HasMany<typeof RolePermission>;

  @belongsTo(() => Entity, { foreignKey: "entity_id" })
  public entity: BelongsTo<typeof Entity>;


}
