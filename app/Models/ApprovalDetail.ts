import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Role from "./Role";
import User from "./User";

export default class ApprovalDetail extends BaseModel {
  public static table = "approval_detail";
  public static $;
  @column({ isPrimary: true })
  public id: string;

  @column()
  public user_id: string;

  @column()
  public validation: string;

  @column()
  public header_id: string;

  @column()
  public remark: string;

  @column()
  public role_id: string;

  @column()
  public sequence: number;

  @column()
  public step: number;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(ApprovalDetail: ApprovalDetail) {
    ApprovalDetail.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(ApprovalDetail: ApprovalDetail) {
    ApprovalDetail.updated_at = new Date();
  }

  @beforeCreate()
  public static async setId(ApprovalDetail: ApprovalDetail) {
    ApprovalDetail.id = uuidv4();
  }

  @belongsTo(() => Role, { foreignKey: "role_id" })
  public role: BelongsTo<typeof Role>;
  @belongsTo(() => User, { foreignKey: "user_id" })
  public user: BelongsTo<typeof User>;
}
