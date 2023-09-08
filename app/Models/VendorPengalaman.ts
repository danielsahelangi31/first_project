import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorPengalaman extends BaseModel {
  public static table = "vendor_pengalaman";

  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_pekerjaan: string

  @column()
  public bidang_jasa: string

  @column()
  public lokasi: string

  @column()
  public kategori: string

  @column()
  public file_spk: string

  @column()
  public file_ba: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorPengalaman: VendorPengalaman) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPengalaman.created_at = timestamp;
    VendorPengalaman.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorPengalaman: VendorPengalaman) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPengalaman.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorPengalaman: VendorPengalaman) {
    VendorPengalaman.id = uuidv4();
  }
}
