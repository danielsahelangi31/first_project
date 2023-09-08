import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid';

export default class Apilog extends BaseModel {
  public static table = 'apilogs'

  @column({ isPrimary: true })
  public id: string

  @column()
  public package: string

  @column()
  public userid: string

  @column()
  public payload: any

  @column()
  public request_id: string

  @column()
  public url: string

  @column()
  public master_types: string

  @column()
  public action: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static setId(api: Apilog) {
    api.id = uuidv4();
    api.created_at = new Date();
    api.updated_at = new Date();
  }
}
