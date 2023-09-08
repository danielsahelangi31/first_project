import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid"

export default class StatusKapal extends BaseModel {
   @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public kd_status_kapal: number

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(StatusKapal: StatusKapal) {
    StatusKapal.created_at = new Date();
    StatusKapal.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(StatusKapal: StatusKapal) {
    StatusKapal.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(StatusKapal: StatusKapal) {
    StatusKapal.id = uuidv4();
  }
}
