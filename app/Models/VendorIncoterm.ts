import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorIncoterm extends BaseModel {
  public static table = "vendor_incoterm";

  @column({ isPrimary: true })
  public id: string

  @column()
  public incoterm_1: string

  @column()
  public incoterm_2: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorIncoterm: VendorIncoterm) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorIncoterm.created_at = timestamp;
    VendorIncoterm.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorIncoterm: VendorIncoterm) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorIncoterm.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorIncoterm: VendorIncoterm) {
    VendorIncoterm.id = uuidv4();
  }
}
