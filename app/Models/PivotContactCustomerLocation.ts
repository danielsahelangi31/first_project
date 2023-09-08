import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Cabang from './Cabang';


export default class PivotContactCustomerLocation extends BaseModel {
  public static table = 'pivot_contact_customer_location'

  @column({ isPrimary: true })
  public id: string

  @column()
  public contact_id: string;

  @column()
  public request_contact_id: string;

  @column()
  public cabang_id: string;

  @column()
  public created_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotContactCustomerLocation: PivotContactCustomerLocation) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotContactCustomerLocation.created_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotContactCustomerLocation: PivotContactCustomerLocation) {
    PivotContactCustomerLocation.id = uuidv4();
  }

  @belongsTo(()=> Cabang, {foreignKey: "cabang_id"})
  public cabang : BelongsTo<typeof Cabang>
}
