import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class StrukturAll extends BaseModel {
  public static table = 'struktur_all'
  @column({ isPrimary: true })
  public id: string

  @column()
  public name:string

}
