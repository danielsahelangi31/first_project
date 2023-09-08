import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid"

export default class JenisPelayaran extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public kd_jenis_pelayaran: number

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(JenisPelayaran: JenisPelayaran) {
    JenisPelayaran.created_at = new Date();
    JenisPelayaran.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(JenisPelayaran: JenisPelayaran) {
    JenisPelayaran.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(JenisPelayaran: JenisPelayaran) {
    JenisPelayaran.id = uuidv4();
  }
}
