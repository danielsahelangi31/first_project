import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorIjinUsaha extends BaseModel {
  public static table = "vendor_ijin_usaha";

  @column({ isPrimary: true })
  public id: string

  @column()
  public no_ijin: string

  @column()
  public tgl_ijin: Date

  @column()
  public tgl_berakhir: Date

  @column()
  public instansi_pemberi: string

  @column()
  public dok_ijin_usaha: string

  @column()
  public bidang_usaha: string

  @column()
  public dok_bidang_usaha: string

  @column()
  public tipe_ijin: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorIjinUsaha: VendorIjinUsaha) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorIjinUsaha.created_at = timestamp;
    VendorIjinUsaha.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorIjinUsaha: VendorIjinUsaha) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorIjinUsaha.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorIjinUsaha: VendorIjinUsaha) {
    VendorIjinUsaha.id = uuidv4();
  }
}
