import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import PivotPaymentType from './PivotPaymentType';
import Cabang from './Cabang';

export default class CustomerBilling extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_account: string;

  @column()
  public no_bank_account: string;

  @column()
  public nm_bank: string;

  @column()
  public no_npwp: string;

  @column()
  public location_id: string;

  @column()
  public kd_npwp: string;

  @column()
  public customer_id: string;
  
  @column()
  public flag_npwp_billing: string;

  @column()
  public npwp_address: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;
  @beforeCreate()
  public static async genCreatedAt(CustomerBilling: CustomerBilling) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerBilling.created_at = timestamp;
    CustomerBilling.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(CustomerBilling: CustomerBilling) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerBilling.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(CustomerBilling: CustomerBilling) {
    CustomerBilling.id = uuidv4();
  }

  @belongsTo(()=> Cabang, {foreignKey: "location_id"})
  public location : BelongsTo<typeof Cabang>

  @hasMany(()=> PivotPaymentType, {foreignKey: "billing_id"})
  public paymentType : HasMany<typeof PivotPaymentType>
}
