import { DateTime } from "luxon";
import { beforeCreate, BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import MasterType from "./MasterType";
import Role from "./Role";
import SchemaApprovalList from "App/Models/SchemaApprovalList";

export default class SchemaAplication extends BaseModel {
  public static table = "schema_aplications";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public schema_name: string;
  @column()
  public master_type_id: string;
  @column()
  public role_id: string;

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // public updatedAt: DateTime

  @beforeCreate()
  public static async setId(SchemaAplication: SchemaAplication) {
    SchemaAplication.id = uuidv4();
  }

  @belongsTo(() => Role, { foreignKey: "role_id" })
  public role: BelongsTo<typeof Role>;

  @belongsTo(() => MasterType, { foreignKey: "master_type_id" })
  public masterType: BelongsTo<typeof MasterType>;

  @hasMany(() => SchemaApprovalList, { foreignKey: "schema_id" })
  public approvalList: HasMany<typeof SchemaApprovalList>;
}
