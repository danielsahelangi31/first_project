import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid"

export default class VesselTypeAdditional extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public kd_additonal_info: number

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(VesselTypeAdditional: VesselTypeAdditional) {
    VesselTypeAdditional.created_at = new Date();
    VesselTypeAdditional.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(VesselTypeAdditional: VesselTypeAdditional) {
    VesselTypeAdditional.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(VesselTypeAdditional: VesselTypeAdditional) {
    VesselTypeAdditional.id = uuidv4();
  }
}
