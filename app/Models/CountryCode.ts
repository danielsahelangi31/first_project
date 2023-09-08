
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class CountryCode extends BaseModel {
  @column({ isPrimary: true })
  public code: string;

  @column()
  public name: string;


}
