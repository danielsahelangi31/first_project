import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class SatuanCapacity extends BaseModel {
  public static table = 'satuan_capacities';
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public name: string

  @column.dateTime({ autoCreate: false })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public updatedAt: DateTime
}
