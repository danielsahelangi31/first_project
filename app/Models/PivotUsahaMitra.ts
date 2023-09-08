import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Mitra from './Mitra';
export default class PivotUsahaMitra extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public customer_id: string;

  @column()
  public request_customer_id: string;

  @column()
  public mitra_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotUsahaMitra: PivotUsahaMitra) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotUsahaMitra.created_at = timestamp;
    PivotUsahaMitra.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(PivotUsahaMitra: PivotUsahaMitra) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotUsahaMitra.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotUsahaMitra: PivotUsahaMitra) {
    PivotUsahaMitra.id = uuidv4();
  }

  @belongsTo(()=> Mitra, {foreignKey: "mitra_id"})
  public mitra : BelongsTo<typeof Mitra>
}
