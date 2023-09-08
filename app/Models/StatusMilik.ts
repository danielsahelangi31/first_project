import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class StatusMilik extends BaseModel {
  public static table = 'status_miliks'
  
  @column({ isPrimary: true })
  public id: string
  
  @column()
  public name: string
}
