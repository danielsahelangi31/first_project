import { v4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class TierType extends BaseModel {
  public static table = 'tiertypes';

  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string
  
  @column()
  public insert_date: Date
  
  @column()
  public update_date: Date
  
  @column()
  public sort_no: number

  @beforeCreate()
  public static async setId(data: TierType) {
    data.id = v4();
    data.insert_date = new Date();
  }
}
