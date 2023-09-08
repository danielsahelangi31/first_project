import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_previous_employment'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 10) 
      table.date("begda") 
      table.date("endda") 
      table.string("arbgb", 300) 
      table.string("ort01", 100) 
      table.string("land1", 10) 
      table.string("branc", 10) 
      table.string("brtxt", 300) 
      table.string("taete", 100) 
      table.string("ltext", 500) 
      table.string("ansvx", 10) 
      table.string("anstx", 100) 
      table.string("job_detail", 500) 
      table.string("salary", 20) 
      table.string("currency", 10) 
      table.string("ex_reason", 100) 
      table.string("company_code", 10) 
      table.string("created_by", 50) 
      table.timestamp('created_date', { useTz: true }) 
      table.string("last_updated_by", 50) 
      table.timestamp('last_updated_date', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
