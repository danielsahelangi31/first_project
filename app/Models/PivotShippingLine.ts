import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import ShippingLine from './ShippingLine';

export default class PivotShippingLine extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public customer_id: string;

  @column()
  public request_customer_id: string;

  @column()
  public shipping_line_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotShippingLine: PivotShippingLine) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotShippingLine.created_at = timestamp;
    PivotShippingLine.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(PivotShippingLine: PivotShippingLine) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotShippingLine.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotShippingLine: PivotShippingLine) {
    PivotShippingLine.id = uuidv4();
  }

  @belongsTo(()=> ShippingLine, {foreignKey: "shipping_line_id"})
  public shippingLine : BelongsTo<typeof ShippingLine>
}
