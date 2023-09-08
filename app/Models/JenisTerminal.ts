import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class JenisTerminal extends BaseModel {
  public static table = "jenis_terminals";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime;
}
