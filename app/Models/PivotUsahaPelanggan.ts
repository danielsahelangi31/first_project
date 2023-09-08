import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import UsahaPelanggan from './UsahaPelanggan';

export default class PivotUsahaPelanggan extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public customer_id: string;

  @column()
  public request_customer_id: string;

  @column()
  public usaha_pelanggan_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotUsahaPelanggan: PivotUsahaPelanggan) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotUsahaPelanggan.created_at = timestamp;
    PivotUsahaPelanggan.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(PivotUsahaPelanggan: PivotUsahaPelanggan) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotUsahaPelanggan.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotUsahaPelanggan: PivotUsahaPelanggan) {
    PivotUsahaPelanggan.id = uuidv4();
  }

  @belongsTo(()=> UsahaPelanggan, {foreignKey: "usaha_pelanggan_id"})
  public usahaPelanggan : BelongsTo<typeof UsahaPelanggan>
}
