import { DateTime } from 'luxon'
import { beforeCreate,BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Role from './Role';
import RoleEntitesView from './RoleEntitesView';

export default class SchemaApprovalList extends BaseModel {
  public static table = 'schema_approval_lists'
  @column({ isPrimary: true })
  public id: string
  @column()
  public approval_order: string
  @column()
  public mandatory: string
  @column()
  public role_id: string

  @column()
  public schema_id: string

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // public updatedAt: DateTime

  @beforeCreate()
  public static async setId(SchemaApprovalList: SchemaApprovalList) {
    SchemaApprovalList.id = uuidv4();
  }

  @belongsTo(() => Role , { foreignKey: "role_id" })
  public role: BelongsTo<typeof Role>


}
