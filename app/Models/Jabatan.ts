import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Jabatan extends BaseModel {
  public static table = 'jabatans';

  @column({ isPrimary: true })
  public id: string

  @column()
  public nama_jabatan: string

  @column()
  public level: number
}
