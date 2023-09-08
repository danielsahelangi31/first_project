import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPegawaiEducation extends BaseModel {
  public static table = 'safm_pegawai_education';
  public static primaryKey = 'pernr';
  
  @column()
  public pernr: string

  @column()
  public company_code: string
  
  @column()
  public full_name: string
  
  @column()
  public education_est: string
  
  @column()
  public education_est_desc: string
  
  @column()
  public start_date: Date
  
  @column()
  public end_date: Date
  
  @column()
  public change_date: Date
  
  @column()
  public change_by: string
  
  @column()
  public edu_training: string
  
  @column()
  public et_categories: string
  
  @column()
  public et_categories_text: string
  
  @column()
  public inst_location: string
  
  @column()
  public country_region_key: string
  
  @column()
  public certificate: string
  
  @column()
  public certificate_text: string
  
  @column()
  public duration_no: string
  
  @column()
  public duration_time: string
  
  @column()
  public final_grade: string
  
  @column()
  public branch_of_study_1: string
  
  @column()
  public branch_of_study_1t: string
  
  @column()
  public branch_of_study_2: string
  
  @column()
  public branch_of_study_2t: string
  
  @column()
  public course_subject: string
  
  @column()
  public kategori_pelatihan: string
  
  @column()
  public level_pelatihan: string
  
  @column()
  public certificate_type: string
  
  @column()
  public certi_start_date: Date
  
  @column()
  public certi_expire_date: Date
  
  @column()
  public kategori_pelatihan_text: string
  
  @column()
  public level_pelatihan_text: string
  
  @column()
  public certificate_type_text: string
  
  @column()
  public pend_awal_penerimaan: string
  
  @column()
  public nomor_ijazah: string
  
  @column()
  public fakultas: string
  
  @column()
  public konsentrasi: string

  @column()
  public created_by: string
  
  @column()
  public last_updated_by: string
  
  @column()
  public created_date: Date
  
  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createdData(data: SafmPegawaiEducation) {
    data.created_date = new Date()
  }

  @beforeUpdate()
  public static async updatedData(data: SafmPegawaiEducation) {
    data.created_date = new Date()
  }

}
