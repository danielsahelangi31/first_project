import { v4 } from 'uuid'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'

export default class JenisKapal extends BaseModel {
  public static table = 'jeniskapals';
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public kode_jenis: string
  
  @column()
  public jenis_kapal: string
  
  @column()
  public insert_date: Date
  
  @column()
  public update_date: Date
  
  @column()
  public sort_no: number
  
  @beforeCreate()
  public static async setId(data: JenisKapal) {
    data.id = v4(); 
    data.insert_date = new Date();
  }
}
