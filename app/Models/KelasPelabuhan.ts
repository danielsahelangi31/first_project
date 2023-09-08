import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";

export default class KelasPelabuhan extends BaseModel {
  public static $table = "kelas_pelabuhans";

  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public sort_no: number;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async uuid(KelasPelabuhan: KelasPelabuhan) {
    KelasPelabuhan.id = uuidv4();
  }

}
