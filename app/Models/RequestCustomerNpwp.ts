import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import RequestCustomerInfo from './RequestCustomerInfo';

export default class RequestCustomerNpwp extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public no_npwp: string;

  @column()
  public name: string;

  @column()
  public address: string;

  @column()
  public type: number;

  @column()
  public request_customer_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(RequestCustomerNpwp: RequestCustomerNpwp) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerNpwp.created_at = timestamp;
    RequestCustomerNpwp.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestCustomerNpwp: RequestCustomerNpwp) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerNpwp.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(RequestCustomerNpwp: RequestCustomerNpwp) {
    RequestCustomerNpwp.id = uuidv4();
  }

  @belongsTo(() => RequestCustomerInfo, { foreignKey: "request_customer_id"} )
  public RequestCustomerInfo: BelongsTo<typeof RequestCustomerInfo>
}
