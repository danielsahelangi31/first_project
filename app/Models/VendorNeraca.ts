import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorNeraca extends BaseModel {
  public static table = "vendor_neraca";

  @column({ isPrimary: true })
  public id: string

  @column()
  public tahun: Date

  @column()
  public modal: number

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorNeraca: VendorNeraca) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorNeraca.created_at = timestamp;
    VendorNeraca.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorNeraca: VendorNeraca) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorNeraca.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorNeraca: VendorNeraca) {
    VendorNeraca.id = uuidv4();
  }
}
