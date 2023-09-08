import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class JenisPerairan extends BaseModel {
  public static table = 'jenis_perairans'
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public name: string
}
