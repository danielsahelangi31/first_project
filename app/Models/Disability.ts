import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'

export default class Disability extends BaseModel {
  public static table = 'disability'
  public static primaryKey = 'pernr'
  
  @column()
  public pernr: string

  @column()
  public company_code: string

  @column()
  public nipp: string

  @column()
  public gender: string

  @column()
  public tmt_mulai: Date

  @column()
  public persg: string

  @column()
  public persg_txt: string

  @column()
  public persk: string

  @column()
  public persk_txt: string

  @column()
  public werks: string

  @column()
  public werks_txt: string

  @column()
  public btrtl: string

  @column()
  public btrtl_txt: string

  @column()
  public plans: string

  @column()
  public plans_txt: string

  @column()
  public ansvh: string

  @column()
  public ansvh_txt: string

  @column()
  public exdat: Date

  @column()
  public disab: string

  @column()
  public disab_txt: string
  
  @column()
  public disab_desc: string

  @column()
  public org_path: string

  @column()
  public created_by: string

  @column()
  public last_updated_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createData(data: Disability) {
    data.created_date = new Date();
  }

  @beforeUpdate()
  public static async updateData(data: Disability) {
    data.last_updated_date = new Date();
  }
}
