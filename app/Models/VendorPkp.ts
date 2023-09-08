import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorPkp extends BaseModel {
  public static table = "vendor_pkp";

  @column({ isPrimary: true })
  public id: string

  @column()
  public no_surat: string

  @column()
  public tgl_pkp: Date

  @column()
  public no_npwp: string

  @column()
  public file_dok_pendukung: string

  @column()
  public file_pkp: string

  @column()
  public file_npwp: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorPkp: VendorPkp) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPkp.created_at = timestamp;
    VendorPkp.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorPkp: VendorPkp) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPkp.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorPkp: VendorPkp) {
    VendorPkp.id = uuidv4();
  }
}
