import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPegawaiAction extends BaseModel {
  public static table = 'safm_pegawai_action';
  public static primaryKey = 'pernr';
  
  @column()
  public pernr: string

  @column()
  public company_code: string

  @column()
  public begda: Date
  
  @column()
  public endda: Date
  
  @column()
  public massn: string
  
  @column()
  public mntxt: string
  
  @column()
  public massg: string
  
  @column()
  public mgtxt: string
  
  @column()
  public stat2: string
  
  @column()
  public text1: string
  
  @column()
  public werks: string
  
  @column()
  public name1: string
  
  @column()
  public btrtl: string
  
  @column()
  public lgtxt: string
  
  @column()
  public plans: string
  
  @column()
  public plans_desc: string
  
  @column()
  public persg: string
  
  @column()
  public ptext: string
  
  @column()
  public persk: string
  
  @column()
  public pktxt: string
  
  @column()
  public ansvh: string
  
  @column()
  public atx: string
  
  @column()
  public doc_type: string
  
  @column()
  public stext: string
  
  @column()
  public doc_number: string
  
  @column()
  public issue_date: Date
  
  @column()
  public effective_date: Date
  
  @column()
  public created_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_by: string
  
  @column()
  public last_updated_date: Date
  
  @beforeCreate()
  public static async createdData(data: SafmPegawaiAction) {
    data.created_date = new Date();
  }

  @beforeUpdate()
  public static async updatedData(data: SafmPegawaiAction) {
    data.last_updated_date = new Date();
  }
}
