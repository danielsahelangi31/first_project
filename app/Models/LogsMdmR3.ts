import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import CustomerInfo from "./CustomerInfo";

export default class LogsMdmR3 extends BaseModel {
  public static table = "logs_mdm_r3";

  @column({ isPrimary: true })
  public id: string;

  @column()
  public customer_name: string;

  @column()
  public action: string;

  @column()
  public payload: string;

  @column()
  public response: string;

  @column()
  public customer_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async uuid(LogsMdmR3: LogsMdmR3) {
    LogsMdmR3.id = uuidv4();
  }

  @beforeUpdate()
  public static async genUpdatedAt(LogsMdmR3: LogsMdmR3) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date
    LogsMdmR3.updated_at = timestamp;
  }
  
  
  @beforeCreate()
  public static async genCreatedAt(LogsMdmR3: LogsMdmR3) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date
    LogsMdmR3.created_at = timestamp;
    LogsMdmR3.updated_at = timestamp;
  }

  @belongsTo(() => CustomerInfo, { foreignKey: "customer_id" })
  public CustomerInfo: BelongsTo<typeof CustomerInfo>;

}
