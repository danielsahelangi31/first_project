import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorDokHistory extends BaseModel {
  public static table = "vendor_dok_history";

  @column({ isPrimary: true })
  public id: string

  @column()
  public jenis: string

  @column()
  public deskripsi: string

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorDokHistory: VendorDokHistory) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorDokHistory.created_at = timestamp;
    VendorDokHistory.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorDokHistory: VendorDokHistory) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorDokHistory.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorDokHistory: VendorDokHistory) {
    VendorDokHistory.id = uuidv4();
  }
}
