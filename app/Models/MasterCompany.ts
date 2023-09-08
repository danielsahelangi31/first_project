import { BaseModel, beforeCreate, beforeUpdate, belongsTo, BelongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import MasterCompanyAccount from './MasterCompanyAccount';
import GroupCompany from './GroupCompany';

export default class MasterCompany extends BaseModel {
  public static table = 'master_companies'

  @column({ isPrimary: true })
  public id: string;

  @column()
  public id_parent: string;

  @column()
  public company_code: number;

  @column()
  public company_name: string;

  @column()
  public company_group: string;

  @column()
  public status: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(MasterCompany: MasterCompany) {
    MasterCompany.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(MasterCompany: MasterCompany) {
    MasterCompany.updated_at = new Date();
  }

  @beforeCreate()
  public static async setId(MasterCompany : MasterCompany) {
    MasterCompany.id = uuidv4();
  }

  @hasMany(() => MasterCompanyAccount, {foreignKey: "id_company_terminal"})
  public masterCompanyAccount: HasMany<typeof MasterCompanyAccount>

  @belongsTo(() => GroupCompany, { foreignKey: "company_group" })
  public groupCompany: BelongsTo<typeof GroupCompany>;
}
