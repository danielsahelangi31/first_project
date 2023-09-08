import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorSpt extends BaseModel {
  public static table = "vendor_spt";

  @column({ isPrimary: true })
  public id: string

  @column()
  public tahun: Date

  @column()
  public tgl_spt: Date

  @column()
  public no_spt: string

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorSpt: VendorSpt) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorSpt.created_at = timestamp;
    VendorSpt.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorSpt: VendorSpt) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorSpt.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorSpt: VendorSpt) {
    VendorSpt.id = uuidv4();
  }
}
