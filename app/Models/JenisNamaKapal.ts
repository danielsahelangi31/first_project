import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid"

export default class JenisNamaKapal extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public kd_jenis_nama_kapal: number

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(JenisNamaKapal: JenisNamaKapal) {
    JenisNamaKapal.created_at = new Date();
    JenisNamaKapal.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(JenisNamaKapal: JenisNamaKapal) {
    JenisNamaKapal.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(JenisNamaKapal: JenisNamaKapal) {
    JenisNamaKapal.id = uuidv4();
  }
}
