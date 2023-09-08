import { DateTime } from 'luxon'
import { BaseModel,beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class PostalCode extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public country: string
  
  @column()
  public province: string

  @column()
  public city: string

  @column()
  public subdistrict: string

  @column()
  public village: string

  @column()
  public post_code: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async uuid(PostalCode: PostalCode) {
    PostalCode.id = uuidv4();
  }
}
