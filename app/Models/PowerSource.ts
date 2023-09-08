import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class PowerSource extends BaseModel {
  public static table = 'powersources'
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public name: string
  
  @column()
  public insert_date: Date
  
  @column()
  public update_date: Date
  
  @column()
  public sort_no: number
  
  @beforeCreate()
  public static async setId(data: PowerSource) {
    data.id = uuidv4();
    data.insert_date = new Date();
  }
}
