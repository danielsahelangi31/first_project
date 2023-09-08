import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorAhli extends BaseModel {
  public static table = "vendor_ahli";

  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_ahli: string

  @column()
  public tgl_lahir_ahli: Date

  @column()
  public file: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorAhli: VendorAhli) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorAhli.created_at = timestamp;
    VendorAhli.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorAhli: VendorAhli) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorAhli.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorAhli: VendorAhli) {
    VendorAhli.id = uuidv4();
  }
}
