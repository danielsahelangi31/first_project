import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorPeralatan extends BaseModel {
  public static table = "vendor_peralatan";

  @column({ isPrimary: true })
  public id: string

  @column()
  public jn_alat: string

  @column()
  public jml_alat: number

  @column()
  public kapasitas: number

  @column()
  public merk: string

  @column()
  public tahun_pembuatan: Date

  @column()
  public lokasi: string

  @column()
  public kepemilikan: string

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorPeralatan: VendorPeralatan) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPeralatan.created_at = timestamp;
    VendorPeralatan.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorPeralatan: VendorPeralatan) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPeralatan.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorPeralatan: VendorPeralatan) {
    VendorPeralatan.id = uuidv4();
  }
}
