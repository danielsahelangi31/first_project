import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Regional from "App/Models/Regional";

export default class HeadOffice extends BaseModel {
  public static $table = "head_offices";

  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public company_id: string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async uuid(HeadOffice: HeadOffice) {
    HeadOffice.id = uuidv4();
  }

  @hasMany(() => Regional, { foreignKey: "head_office_id" })
  public regionals: HasMany<typeof Regional>;
}
