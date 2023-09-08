import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class CustomerNpwpv2 extends BaseModel {
  public static table = "customer_npwps";
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
  public customer_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(CustomerNpwpv2: CustomerNpwpv2) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerNpwpv2.created_at = timestamp;
    CustomerNpwpv2.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(CustomerNpwpv2: CustomerNpwpv2) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerNpwpv2.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(CustomerNpwpv2: CustomerNpwpv2) {
    CustomerNpwpv2.id = uuidv4();
  }
}
