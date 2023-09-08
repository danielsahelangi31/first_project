import { BaseModel, column, beforeCreate, beforeUpdate} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";

export default class InaportnetLog extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public action: string

  @column()
  public payload: string

  @column()
  public response: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async genCreatedAt(InaportnetLog: InaportnetLog) {
    InaportnetLog.created_at = new Date();
    InaportnetLog.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(InaportnetLog: InaportnetLog) {
    InaportnetLog.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(InaportnetLog: InaportnetLog) {
    InaportnetLog.id = uuidv4();
  }
}
