import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'

export default class PelaksanaHarian extends BaseModel {
  public static table = 'pelaksana_harian'
  public static primaryKey = 'pernr'
  
  @column()
  public pernr: string

  @column()
  public nipp: string

  @column()
  public cname: string 

  @column()
  public subty: string

  @column()
  public subty_txt: string

  @column()
  public begda: Date

  @column()
  public endda: Date

  @column()
  public plans: string

  @column()
  public plans_txt: string

  @column()
  public dpernr: string

  @column()
  public dnipp: string

  @column()
  public dcname: string

  @column()
  public dplans: string

  @column()
  public dplans_txt: string

  @column()
  public workitem_id: string

  @column()
  public company_code: string

  @column()
  public created_by: string

  @column()
  public last_updated_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createData(data: PelaksanaHarian) {
    data.created_date = new Date()
  }
  
  @beforeUpdate()
  public static async updateDate(data: PelaksanaHarian) {
    data.last_updated_date = new Date()
  }
}
