import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'

export default class CauseOfDeath extends BaseModel {
  public static table = 'cause_of_death'
  public static primaryKey = 'pernr'
  
  @column()
  public pernr: string

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
  public asal: string
  
  @column()
  public kj: string
  
  @column()
  public golongan: string

  @column()
  public gbdat: Date

  @column()
  public carto: string

  @column()
  public cdeat: string

  @column()
  public death: Date

  @column()
  public caude: string

  @column()
  public caude_desc: string

  @column()
  public docnr: string

  @column()
  public org_path: string

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
  public static async createData(data: CauseOfDeath) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updateData(data: CauseOfDeath) {
    data.last_updated_date = new Date()
  }

}
