import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class RequestVendorBankAccount extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public account_holder: string

  @column()
  public nm_bank: string

  @column()
  public no_rek: string
  
  @column()
  public buku_tabungan: string
  
  @column()
  public request_vendor_id: string

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(RequestVendorBankAccount: RequestVendorBankAccount) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestVendorBankAccount.created_at = timestamp;
    RequestVendorBankAccount.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestVendorBankAccount: RequestVendorBankAccount) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestVendorBankAccount.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(RequestVendorBankAccount: RequestVendorBankAccount) {
    RequestVendorBankAccount.id = uuidv4();
  }
}
