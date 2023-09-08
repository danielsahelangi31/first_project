import { DateTime } from "luxon";
import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import JenisTerminal from "App/Models/JenisTerminal";
import User from "App/Models/User";
export default class ApprovalLog extends BaseModel {
  public static table = "approval_log";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public request_no: string;

  @column()
  public action: string;

  @column()
  public remark: string;

  @column()
  public created_by: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;


  @beforeCreate()
  public static async genCreatedAt(ApprovalLog: ApprovalLog) {
    ApprovalLog.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(ApprovalLog: ApprovalLog) {
    ApprovalLog.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(ApprovalLog: ApprovalLog) {
    ApprovalLog.id = uuidv4();
  }

  @belongsTo(() => User, { foreignKey: "created_by" })
  public user: BelongsTo<typeof User>;
}
