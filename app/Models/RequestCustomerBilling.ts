import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import PivotPaymentType from './PivotPaymentType';
import RequestCustomerInfo from './RequestCustomerInfo';

export default class RequestCustomerBilling extends BaseModel {
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
  public request_customer_id: string;

  @column()
  public flag_npwp_billing: string;

  @column()
  public npwp_address: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;
  @beforeCreate()
  public static async genCreatedAt(RequestCustomerBilling: RequestCustomerBilling) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerBilling.created_at = timestamp;
    RequestCustomerBilling.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestCustomerBilling: RequestCustomerBilling) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerBilling.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(RequestCustomerBilling: RequestCustomerBilling) {
    RequestCustomerBilling.id = uuidv4();
  }

  @hasMany(()=> PivotPaymentType, {foreignKey: "request_billing_id"})
  public paymentType : HasMany<typeof PivotPaymentType>

  @belongsTo(() => RequestCustomerInfo, { foreignKey: "request_customer_id"} )
  public RequestCustomerInfo: BelongsTo<typeof RequestCustomerInfo>
}
