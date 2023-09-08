import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_education'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 8) 
      table.string("full_name", 80) 
      table.string("education_est", 2) 
      table.string("education_est_desc", 40) 
      table.date("start_date") 
      table.date("end_date") 
      table.date("change_date") 
      table.string("change_by", 12) 
      table.string("edu_training", 8) 
      table.string("et_categories", 3) 
      table.string("et_categories_text", 25) 
      table.string("inst_location", 80) 
      table.string("country_region_key", 3) 
      table.string("certificate", 2) 
      table.string("certificate_text", 40) 
      table.string("duration_no", 3) 
      table.string("duration_time", 20) 
      table.string("final_grade", 4) 
      table.string("branch_of_study_1", 5) 
      table.string("branch_of_study_1t", 40) 
      table.string("branch_of_study_2", 5) 
      table.string("branch_of_study_2t", 40) 
      table.string("course_subject", 80) 
      table.string("kategori_pelatihan", 1) 
      table.string("level_pelatihan", 1) 
      table.string("certificate_type", 1) 
      table.date("certi_start_date") 
      table.date("certi_expire_date") 
      table.string("company_code", 10) 
      table.string("created_by", 30) 
      table.string("last_updated_by", 30)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string("kategori_pelatihan_text", 60) 
      table.string("level_pelatihan_text", 60) 
      table.string("certificate_type_text", 60) 
      table.string("pend_awal_penerimaan", 1) 
      table.string("nomor_ijazah", 100) 
      table.string("fakultas", 256) 
      table.string("konsentrasi", 256)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
