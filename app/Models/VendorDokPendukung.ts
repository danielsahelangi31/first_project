import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorDokPendukung extends BaseModel {
  public static table = "vendor_dok_pendukung";

  @column({ isPrimary: true })
  public id: string

  @column()
  public surat_pernyataan: string

  @column()
  public surat_kuasa: string

  @column()
  public ktp_pemberi_kuasa: string

  @column()
  public ktp_penerima_kuasa: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorDokPendukung: VendorDokPendukung) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorDokPendukung.created_at = timestamp;
    VendorDokPendukung.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorDokPendukung: VendorDokPendukung) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorDokPendukung.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorDokPendukung: VendorDokPendukung) {
    VendorDokPendukung.id = uuidv4();
  }
}
