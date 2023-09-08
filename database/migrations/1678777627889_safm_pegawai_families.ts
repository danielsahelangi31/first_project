import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_family'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 8) 
      table.string("full_name", 80)
      table.string("family_type", 4)
      table.string("family_type_desc", 40) 
      table.date("start_date") 
      table.date("end_date") 
      table.date("change_date") 
      table.string("change_by", 12) 
      table.string("name", 40) 
      table.string("gender_key", 1) 
      table.string("gender", 80) 
      table.string("birth_place", 40) 
      table.date("birth_date") 
      table.string("nationality", 3) 
      table.string("country_of_birth", 3) 
      table.string("id_card_no", 30) 
      table.string("id_card_type", 5) 
      table.date("date_of_issue") 
      table.string("place_of_issue", 30) 
      table.string("relatives", 8) 
      table.string("company_code", 10) 
      table.string("created_by", 50) 
      table.string("last_updated_by", 50) 
      table.timestamp('created_date', { useTz: true })
      table.timestamp('last_updated_date', { useTz: true }) 
      table.string("passport_no", 50) 
      table.date("pass_expiry_date") 
      table.string("job_title", 50) 
      table.string("employer", 100) 
      table.date("married_status_date") 
      table.string("tangdinas", 2)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
