import { BaseModel, beforeCreate, beforeUpdate,column} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class VendorBankAccount extends BaseModel {
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
  public vendor_id: string

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(VendorBankAccount: VendorBankAccount) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorBankAccount.created_at = timestamp;
    VendorBankAccount.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorBankAccount: VendorBankAccount) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorBankAccount.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorBankAccount: VendorBankAccount) {
    VendorBankAccount.id = uuidv4();
  }
}
