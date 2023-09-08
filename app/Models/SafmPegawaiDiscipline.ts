import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPegawaiDiscipline extends BaseModel {
  public static table = 'safm_pegawai_discipline';
  public static primaryKey = 'pernr';
  
  @column()
  public pernr: string

  @column()
  public company_code: string
  
  @column()
  public full_name: string
  
  @column()
  public subtype: string
  
  @column()
  public subtype_text: string
  
  @column()
  public start_date: Date
  
  @column()
  public end_date: Date
  
  @column()
  public change_date: Date
  
  @column()
  public change_by: string
  
  @column()
  public company_policy: string
  
  @column()
  public reason: string
  
  @column()
  public reason_text: string
  
  @column()
  public date_entered: Date
  
  @column()
  public result: string
  
  @column()
  public result_text: string
  
  @column()
  public date_settled: Date
  
  @column()
  public tuntutan_ganti_rugi: string
  
  @column()
  public no_document_sk: string
  
  @column()
  public grievance_text: string

  @column()
  public created_by: string
  
  @column()
  public last_updated_by: string

  @column()
  public created_date: Date
  
  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createdData(data: SafmPegawaiDiscipline) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updatedData(data: SafmPegawaiDiscipline) {
    data.last_updated_date = new Date()
  }
}
