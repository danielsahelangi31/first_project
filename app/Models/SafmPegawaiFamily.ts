import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPegawaiFamily extends BaseModel {
  public static table = 'safm_pegawai_family';
  public static primaryKey = 'pernr';
  
  @column()
  public pernr: string

  @column()
  public company_code: string

  @column()
  public full_name: string

  @column()
  public family_type: string

  @column()
  public family_type_desc: string

  @column()
  public start_date: Date

  @column()
  public end_date: Date

  @column()
  public change_date: Date

  @column()
  public change_by: string

  @column()
  public name: string

  @column()
  public gender_key: string

  @column()
  public gender: string

  @column()
  public birth_place: string
  
  @column()
  public birth_date: Date

  @column()
  public nationality: string

  @column()
  public country_of_birth: string

  @column()
  public id_card_no: string

  @column()
  public id_card_type: string

  @column()
  public date_of_issue: Date

  @column()
  public place_of_issue: string

  @column()
  public relatives: string

  @column()
  public passport_no: string

  @column()
  public pass_expiry_date: Date

  @column()
  public job_title: string

  @column()
  public employer: string

  @column()
  public married_status_date: Date

  @column()
  public tangdinas: string

  @column()
  public object_ident: string

  @column()
  public created_by: string

  @column()
  public last_updated_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createdDate(data: SafmPegawaiFamily) {
    data.created_date = new Date();
  }

  @beforeUpdate()
  public static async updatedDate(data: SafmPegawaiFamily) {
    data.last_updated_date = new Date();
  }

}
