import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Country from './Country';

export default class City extends BaseModel {
  public static table = "cities";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public city_name: string;

  @column()
  public city_code: string;

  @column()
  public country_id: string;

  @beforeCreate()
  public static async uuid(city: City) {
    city.id = uuidv4();
  }

  @belongsTo(() => Country, { foreignKey: "country_id" })
  public country: BelongsTo<typeof Country>;
}
