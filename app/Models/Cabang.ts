import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Country from "App/Models/Country";
import { v4 as uuidv4 } from "uuid";

export default class Cabang extends BaseModel {
  public static table = "cabang";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public regional_id: string;

  @beforeCreate()
  public static async uuid(Cabang: Cabang) {
    Cabang.id = uuidv4();
  }

}
