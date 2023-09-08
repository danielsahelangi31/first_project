import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorPic extends BaseModel {
  public static table = "vendor_pic";

  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_pic: string

  @column()
  public jabatan_pic: string

  @column()
  public email_pic: string

  @column()
  public mobile_pic: string

  @column()
  public file_ktp: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorPic: VendorPic) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPic.created_at = timestamp;
    VendorPic.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorPic: VendorPic) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorPic.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorPic: VendorPic) {
    VendorPic.id = uuidv4();
  }
}
