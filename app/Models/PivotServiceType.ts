import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import ServiceType from './ServiceType';
export default class PivotServiceType extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public customer_id: string;

  @column()
  public request_customer_id: string;

  @column()
  public service_type_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotServiceType: PivotServiceType) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotServiceType.created_at = timestamp;
    PivotServiceType.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(PivotServiceType: PivotServiceType) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotServiceType.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotServiceType: PivotServiceType) {
    PivotServiceType.id = uuidv4();
  }

  @belongsTo(()=> ServiceType, {foreignKey: "service_type_id"})
  public serviceType : BelongsTo<typeof ServiceType>
}
