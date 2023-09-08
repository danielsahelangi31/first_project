import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorAuditor extends BaseModel {
  public static table = "vendor_auditor";

  @column({ isPrimary: true })
  public id: string

  @column()
  public auditor: string

  @column()
  public no_audit: string

  @column()
  public tgl_audit: Date

  @column()
  public kesimpulan: string

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorAuditor: VendorAuditor) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorAuditor.created_at = timestamp;
    VendorAuditor.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorAuditor: VendorAuditor) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorAuditor.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorAuditor: VendorAuditor) {
    VendorAuditor.id = uuidv4();
  }
}
