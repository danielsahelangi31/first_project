import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid"

export default class JenisSuratUkur extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public kd_jenis_surat_ukur: number

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(JenisSuratUkur: JenisSuratUkur) {
    JenisSuratUkur.created_at = new Date();
    JenisSuratUkur.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(JenisSuratUkur: JenisSuratUkur) {
    JenisSuratUkur.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(JenisSuratUkur: JenisSuratUkur) {
    JenisSuratUkur.id = uuidv4();
  }
}
