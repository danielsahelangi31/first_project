import { v4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class KategoriAlat extends BaseModel {
  public static table = 'kategorialats';
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public kategori: string
  
  @column()
  public insert_date: Date
  
  @column()
  public update_date: Date
  
  @column()
  public sort_no: number

  @beforeCreate()
  public static async setId(data: KategoriAlat) {
    data.id = v4();
    data.insert_date = new Date();
  } 
  
}
