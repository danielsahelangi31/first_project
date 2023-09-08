import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPegawaiPreviousEmployment extends BaseModel {
  public static table = 'safm_pegawai_previous_employment';
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
  public arbgb: string

  @column()
  public ort01: string

  @column()
  public land1: string

  @column()
  public branc: string

  @column()
  public brtxt: string

  @column()
  public taete: string

  @column()
  public ltext: string

  @column()
  public ansvx: string

  @column()
  public anstx: string

  @column()
  public job_detail: string 

  @column()
  public salary: string

  @column()
  public currency: string

  @column()
  public ex_reason: string

  @column()
  public created_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_by: string

  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createdDate(data: SafmPegawaiPreviousEmployment) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updatedDate(data: SafmPegawaiPreviousEmployment) {
    data.last_updated_date = new Date();
  }

}
