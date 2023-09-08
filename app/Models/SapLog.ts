import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import CustomerBasicInfo from "App/Models/CustomerBasicInfo";
import VesselGeneralInfo from "./VesselGeneralInfo";
import CustomerInfo from "./CustomerInfo";

export default class SapLog extends BaseModel {
  public static table = "sap_log";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public id_basic_info: string;

  @column()
  public vessel_id: string;

  @column()
  public request_payload: string;

  @column()
  public response: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async uuid(SapLog: SapLog) {
    SapLog.id = uuidv4();
  }

  @beforeUpdate()
  public static async genUpdatedAt(SapLog: SapLog) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date
    SapLog.updated_at = timestamp;
  }
  
  
  @beforeCreate()
  public static async genCreatedAt(SapLog: SapLog) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date
    SapLog.created_at = timestamp;
    SapLog.updated_at = timestamp;
  }

  // @belongsTo(() => CustomerBasicInfo, { foreignKey: "id_basic_info" })
  // public customerBasicInfo: BelongsTo<typeof CustomerBasicInfo>;

  @belongsTo(() => CustomerInfo, { foreignKey: "id_basic_info" })
  public CustomerInfo: BelongsTo<typeof CustomerInfo>;

  @belongsTo(() => VesselGeneralInfo, { foreignKey: "vessel_id" })
  public vesselGeneralInfo: BelongsTo<typeof VesselGeneralInfo>;
}
