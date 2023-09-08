import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import CountryCode from "App/Models/CountryCode";
import MasterType from "App/Models/MasterType";
export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public from: string;

  @column()
  public to: string;

  @column()
  public request_no: string;

  @column()
  public master_type_id: string;

  @column()
  public status: string;

  @column()
  public read: number;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(Notification: Notification) {
    Notification.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(Notification: Notification) {
    Notification.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(Notification: Notification) {
    Notification.id = uuidv4();
  }

  @belongsTo(() => MasterType, { foreignKey: "master_type_id" })
  public masterType: BelongsTo<typeof MasterType>;
}
