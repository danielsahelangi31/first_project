import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmStrukturOrganisasi extends BaseModel {
  public static table = 'safm_struktur_organisasi'
  public static primaryKey = 'objid'
  
  @column()
  public plvar: string

  @column()
  public otype: string
  
  @column()
  public pin: string

  @column()
  public objid: string

  @column()
  public parot: string

  @column()
  public parid: string

  @column()
  public begda: Date

  @column()
  public endda: Date

  @column()
  public short: string

  @column()
  public stext: string

  @column()
  public vbeg: Date

  @column()
  public vend: Date

  @column()
  public tlevel: number

  @column()
  public flag_chief: string
  
  @column()
  public kostenstelle: string

  @column()
  public persa: string
  
  @column()
  public btrtl: string
  
  @column()
  public persa_new: string
  
  @column()
  public btrtl_new: string
  
  @column()
  public persg: string
  
  @column()
  public persk: string
  
  @column()
  public company_code: string
  
  @column()
  public kodeunitkerja: string
  
  @column()
  public koderegional: string
  
  @column()
  public kodeactivity: string
  
  @column()
  public descactivity: string
  
  @column()
  public descbobotorganisasi: string
  
  @column()
  public levelorganisasi: string
  
  @column()
  public persareatext: string
  
  @column()
  public perssubareatext: string
  
  @column()
  public generaltext: string
  
  @column()
  public generaltextpar: string
  
  @column()
  public costcenter: string
  
  @column()
  public costcentertext: string
  
  @column()
  public chiefposition: string
  
  @column()
  public kode_jobstream: string
  
  @column()
  public desc_jobstream: string
  
  @column()
  public program_name: string

  @column()
  public jobid: string

  @column()
  public jobname: string

  @column()
  public kj_posisi: string

  @column()
  public kj_posisi_new: string

  @column()
  public job_point: string
  
  @column()
  public kd_aktif: string
  
  @column()
  public werks: string

  @column()
  public created_by: string
  
  @column()
  public last_updated_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createDate(data: SafmStrukturOrganisasi) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updatedDate(data: SafmStrukturOrganisasi) {
    data.last_updated_date = new Date();
  }
}
