import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class JenisKonstruksi extends BaseModel {
  public static table = 'jenis_konstruksis'
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public name: string
}
