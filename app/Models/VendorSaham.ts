import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorSaham extends BaseModel {
  public static table = "vendor_saham";

  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_pemegang: string

  @column()
  public no_ktp: string

  @column()
  public address: string

  @column()
  public jml_saham: number

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorSaham: VendorSaham) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorSaham.created_at = timestamp;
    VendorSaham.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorSaham: VendorSaham) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorSaham.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorSaham: VendorSaham) {
    VendorSaham.id = uuidv4();
  }
}
