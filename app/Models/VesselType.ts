import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VesselType extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public jn_kapal:string

  @column()
  public tipe_kapal:string

  @column()
  public spesifik_kapal:string

  @column()
  public kode:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
