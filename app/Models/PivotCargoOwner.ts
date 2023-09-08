import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import CargoOwner from './CargoOwner';

export default class PivotCargoOwner extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public customer_id: string;

  @column()
  public request_customer_id: string;

  @column()
  public cargo_owner_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(PivotCargoOwner: PivotCargoOwner) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotCargoOwner.created_at = timestamp;
    PivotCargoOwner.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(PivotCargoOwner: PivotCargoOwner) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    PivotCargoOwner.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(PivotCargoOwner: PivotCargoOwner) {
    PivotCargoOwner.id = uuidv4();
  }

  @belongsTo(()=> CargoOwner, {foreignKey: "cargo_owner_id"})
  public cargoOwner : BelongsTo<typeof CargoOwner>
}
