import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class VesselTrayek extends BaseModel {
  public static table = "vessel_trayeks";
  @column({ isPrimary: true })
  public id: string;
  
  @column()
  public name: string;
  
  @column()
  public kd_trayek: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
