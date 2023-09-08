import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorSertifikatLain extends BaseModel {
  public static table = "vendor_sertifikasi_lain";

  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_sertifikat: string

  @column()
  public no_sertifikat: string

  @column()
  public tgl_terbit: Date

  @column()
  public tgl_berakhir: Date

  @column()
  public tahun_pembuatan: Date

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorSertifikatLain: VendorSertifikatLain) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorSertifikatLain.created_at = timestamp;
    VendorSertifikatLain.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorSertifikatLain: VendorSertifikatLain) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorSertifikatLain.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorSertifikatLain: VendorSertifikatLain) {
    VendorSertifikatLain.id = uuidv4();
  }
}
