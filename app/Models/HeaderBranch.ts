import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Regional from "App/Models/Regional";
import { v4 as uuidv4 } from "uuid";

export default class HeaderBranch extends BaseModel {
  public static table = "header_branch";
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public head_office_id: string;

  @beforeCreate()
  public static async uuid(HeaderBranch: HeaderBranch) {
    HeaderBranch.id = uuidv4();
  }

  @belongsTo(() => Regional, { foreignKey: "regional_id" })
  public regional: BelongsTo<typeof Regional>;
}
