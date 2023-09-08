import { BaseModel, HasMany, beforeCreate, beforeUpdate, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import VesselTypeAdditional from './VesselTypeAdditional';

export default class VesselAdditionalPivot extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public vessel_id: string;

  @column()
  public request_vessel_id: string;
  
  @column()
  public kd_additional_info: number;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(VesselAdditionalPivot: VesselAdditionalPivot) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    VesselAdditionalPivot.created_at = timestamp;
    VesselAdditionalPivot.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VesselAdditionalPivot: VesselAdditionalPivot) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    VesselAdditionalPivot.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VesselAdditionalPivot: VesselAdditionalPivot) {
    VesselAdditionalPivot.id = uuidv4();
  }

  @hasMany(() => VesselTypeAdditional, {foreignKey: "kd_additonal_info"})
  public additionalInfo : HasMany<typeof VesselTypeAdditional>
}
