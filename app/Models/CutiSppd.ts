import { BaseModel, column, beforeCreate, beforeUpdate } from '@ioc:Adonis/Lucid/Orm'

export default class CutiSppd extends BaseModel {
  public static table = 'cuti_sppds'
  public static primaryKey = 'pernr'
  
  @column()
  public pernr: string

  @column()
  public full_name: string
  
  @column()
  public personel_area: string
  
  @column()
  public personel_sub_area: string
  
  @column()
  public att_absence_type: string
  
  @column()
  public att_type_text: string
  
  @column()
  public status: string
  
  @column()
  public start_date: Date
  
  @column()
  public end_date: Date
  
  @column()
  public plh: string
  
  @column()
  public plhname: string
  
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
  public static async createData(data: CutiSppd) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updateData(data: CutiSppd) {
    data.last_updated_date = new Date()
  }

}
