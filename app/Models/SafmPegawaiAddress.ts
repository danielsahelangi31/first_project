import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPegawaiAddress extends BaseModel {
  public static table = 'safm_pegawai_addresses'
  public static primaryKey = 'pernr'
  
  @column()
  public pernr: string

  @column()
  public company_code: string
  
  @column()
  public full_name: string
  
  @column()
  public address_type: string
  
  @column()
  public address_type_text: string
  
  @column()
  public start_date: Date
  
  @column()
  public end_date: Date
  
  @column()
  public change_date: Date
  
  @column()
  public change_by: string
  
  @column()
  public street_and_house_no: string
  
  @column()
  public contact_name: string
  
  @column()
  public second_address_line: string
  
  @column()
  public district: string
  
  @column()
  public city: string
  
  @column()
  public postal_code: string
  
  @column()
  public region: string
  
  @column()
  public region_text: string
  
  @column()
  public country: string
  
  @column()
  public country_text: string

  @column()
  public created_by: string
  
  @column()
  public last_updated_by: string
  
  @column()
  public created_date: Date
  
  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createdDate(data: SafmPegawaiAddress) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updatedDate(data: SafmPegawaiAddress) {
    data.last_updated_date = new Date()
  }
}
