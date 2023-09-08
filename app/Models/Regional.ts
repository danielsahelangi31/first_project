import { DateTime } from "luxon";
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import HeadOffice from "App/Models/HeadOffice";

export default class Regional extends BaseModel {
  public static table = "regionals";
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

  @column()
  public company_id: string;

  @beforeCreate()
  public static async uuid(Regional: Regional) {
    Regional.id = uuidv4();
  }

  @belongsTo(() => HeadOffice, { foreignKey: "head_office_id" })
  public headOffice: BelongsTo<typeof HeadOffice>;
}
