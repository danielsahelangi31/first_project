import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class JenisDermaga extends BaseModel {
  public static table = 'jenis_dermagas'
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public name: string
}
