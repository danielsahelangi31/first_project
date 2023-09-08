import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import MasterCompany from './MasterCompany';

export default class MasterCompanyAccount extends BaseModel {
  public static table = "master_company_account_numbers"

@column({ isPrimary: true })
  public id: string;

  @column()
  public id_company_terminal: string;

  @column()
  public profit_center: string;

  @column()
  public sap_code: number;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(MasterCompanyAccount: MasterCompanyAccount){
    MasterCompanyAccount.created_at = new Date()
  }

  @beforeUpdate()
  public static async genUpdatedAt(MasterCompanyAccount: MasterCompanyAccount){
    MasterCompanyAccount.updated_at = new Date()
  }

  @belongsTo(() => MasterCompany, { foreignKey: "id_company_terminal"})
  public masterCompany: BelongsTo<typeof MasterCompany>

  @beforeCreate()
  public static async setId(MasterCompanyAccount: MasterCompanyAccount) {
    MasterCompanyAccount.id = uuidv4();
  }
}
