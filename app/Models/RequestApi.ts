import { DateTime } from "luxon";
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column, beforeUpdate } from "@ioc:Adonis/Lucid/Orm";
import MasterType from "App/Models/MasterType";
import { v4 as uuidv4 } from "uuid";
import PermissionApi from "App/Models/PermissionApi";

export default class RequestApi extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public master_type_id: string;

  @column()
  public institusi: string;

  @column()
  public app_name: string;

  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public phone: string;

  @column()
  public approved_by: string;

  @column()
  public approved_at: DateTime;

  @column()
  public status: number;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async setId(RequestApi: RequestApi) {
    RequestApi.id = uuidv4();
  }

  @beforeCreate()
  public static async genCreatedAt(RequestApi: RequestApi) {
    RequestApi.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestApi: RequestApi) {
    RequestApi.updated_at = new Date();
  }

  @belongsTo(() => MasterType, { foreignKey: "master_type_id" })
  public masterType: BelongsTo<typeof MasterType>;

}
