import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class MasterType extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public : string;

  @column()
  master_name : string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;
}
