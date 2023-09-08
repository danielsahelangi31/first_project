import { BaseModel, beforeCreate, beforeUpdate, belongsTo, BelongsTo, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import ApprovalDetail from "./ApprovalDetail";
import User from "./User";

export default class ApprovalHeader extends BaseModel {
  public static table = "approval_header";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public no_request: string;

  @column()
  public total_approve: number;

  @column()
  public id_submitter: string;

  @column()
  public approval_sequence: number;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @column()
  public step: number;

  @beforeCreate()
  public static async genCreatedAt(ApprovalHeader: ApprovalHeader) {
    ApprovalHeader.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(ApprovalHeader: ApprovalHeader) {
    ApprovalHeader.updated_at = new Date();
  }

  @beforeCreate()
  public static async setId(ApprovalHeader: ApprovalHeader) {
    ApprovalHeader.id = uuidv4();
  }

  @belongsTo(() => User, { foreignKey: "id_submitter" })
  public user: BelongsTo<typeof User>;

  @hasMany(() => ApprovalDetail, {foreignKey:"header_id"})
  public approvalDetail: HasMany<typeof ApprovalDetail>
}
