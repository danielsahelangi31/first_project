import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorPengurus extends BaseModel {
  public static table = "vendor_pengurus";

  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_pengurus: string

  @column()
  public no_ktp: string

  @column()
  public jabatan: string

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorPengurus: VendorPengurus) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPengurus.created_at = timestamp;
    VendorPengurus.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorPengurus: VendorPengurus) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPengurus.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorPengurus: VendorPengurus) {
    VendorPengurus.id = uuidv4();
  }
}
