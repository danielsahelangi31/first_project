import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class CompanyView extends BaseModel {
  public static table = 'company_view'
  @column({ isPrimary: true })
  public id: string;
  
  @column()
  public id_parent: string;

  @column()
  public code_parent: number;

  @column()
  public code_company: number;

  @column()
  public company_name: string;

  @column()
  public company_group: string;

  @column()
  public status: string;

  @column()
  public profit_center: string;

  @column()
  public sap_code: number;

  @column()
  public created_at: Date;
}