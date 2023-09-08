import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorLandasanHukum extends BaseModel {
  public static table = "vendor_landasan_hukum";

  @column({ isPrimary: true })
  public id: string

  @column()
  public no_sertifikat: string

  @column()
  public tgl_sertifikat: Date

  @column()
  public tgl_berakhir: Date

  @column()
  public penanda_tangan: string

  @column()
  public link_lpjk: string

  @column()
  public bidang_usaha: string

  @column()
  public vendor_id: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(VendorLandasanHukum: VendorLandasanHukum) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorLandasanHukum.created_at = timestamp;
    VendorLandasanHukum.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorLandasanHukum: VendorLandasanHukum) {
    let date = new Date();
    // date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorLandasanHukum.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorLandasanHukum: VendorLandasanHukum) {
    VendorLandasanHukum.id = uuidv4();
  }
}
