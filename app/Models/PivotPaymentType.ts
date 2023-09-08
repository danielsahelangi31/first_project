import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import PaymentType from './PaymentType';

export default class PivotPaymentType extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public billing_id: string;
  
  @column()
  public request_billing_id: string;

  @column()
  public payment_types_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotPaymentType: PivotPaymentType) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotPaymentType.created_at = timestamp;
    PivotPaymentType.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(PivotPaymentType: PivotPaymentType) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotPaymentType.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotPaymentType: PivotPaymentType) {
    PivotPaymentType.id = uuidv4();
  }

  @belongsTo(()=> PaymentType, {foreignKey: "payment_types_id"})
  public payment : BelongsTo<typeof PaymentType>
}
