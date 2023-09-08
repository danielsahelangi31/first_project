import { v4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SatuanKapasita extends BaseModel {
  public static table = 'satuankapasitas';
  
  @column({ isPrimary: true })
  public id: string

  @column()
  public satuan: string
  
  @column()
  public insert_date: Date
  
  @column()
  public update_date: Date
  
  @column()
  public sort_no: number

  @beforeCreate()
  public static async setId(data: SatuanKapasita) {
    data.id = v4();
    data.insert_date = new Date();
  }
}
