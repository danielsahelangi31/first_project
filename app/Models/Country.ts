import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class Country extends BaseModel {
  public static table = 'countries'

  @column({ isPrimary: true })
  public id: string

  @column()
  public country_name: string

  @column()
  public country_code: string

  @column()
  public country_code_3_digits: string

  @column()
  public insert_date: Date

  @column()
  public update_date: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async setId(Country: Country) {
    Country.id = uuidv4();
    Country.insert_date = new Date();
  }
}
