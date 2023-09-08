import {v4 as uuidv4} from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class GroupAlat extends BaseModel {
  public static table = 'groupalats';
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public kode_alat: string
  
  @column()
  public deskripsi_alat: string

  @column()
  public insert_date: Date
  
  @column()
  public update_date: Date

  @beforeCreate()
  public static async setId(data: GroupAlat) {
    data.id = uuidv4();
    data.insert_date = new Date();
  }
  
}
