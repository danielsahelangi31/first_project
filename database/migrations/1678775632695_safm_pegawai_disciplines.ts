import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_discipline'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 8) 
      table.string("full_name", 80) 
      table.string("subtype", 4) 
      table.string("subtype_text", 40) 
      table.date("strat_date") 
      table.date("end_date") 
      table.date("change_date") 
      table.string("change_by", 12) 
      table.string("company_policy", 1) 
      table.string("reason", 2) 
      table.string("reason_text", 200) 
      table.date("date_entered") 
      table.string("result", 2) 
      table.string("result_text", 20) 
      table.date("date_settled") 
      table.string("tuntutan_ganti_rugi", 15) 
      table.string("company_code", 10) 
      table.string("created_by", 30), 
      table.string("last_updated_by", 30) 
      table.timestamp('created_date', { useTz: true })
      table.timestamp('last_updated_date', { useTz: true }) 
      table.string("no_document_sk", 60) 
      table.string("grievance_text", 600)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
