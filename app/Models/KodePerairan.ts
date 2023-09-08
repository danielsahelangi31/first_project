import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";

export default class KodePerairan extends BaseModel {
  public static $table = "kode_perairans";

  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async uuid(KodePerairan: KodePerairan) {
    KodePerairan.id = uuidv4();
  }
}
