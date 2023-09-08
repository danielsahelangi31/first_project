import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_action'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 10)
      table.date("begda") 
      table.date("endda") 
      table.string("massn", 3) 
      table.string("mntxt", 50) 
      table.string("massg", 3) 
      table.string("mgtxt", 50) 
      table.string("stat2", 2) 
      table.string("text1", 200) 
      table.string("werks", 10) 
      table.string("name1", 200) 
      table.string("btrtl", 10) 
      table.string("lgtxt", 200) 
      table.string("plans", 10) 
      table.string("plans_desc", 200) 
      table.string("persg", 10) 
      table.string("ptext", 100) 
      table.string("persk", 10) 
      table.string("pktxt", 100) 
      table.string("ansvh", 10) 
      table.string("atx", 100) 
      table.string("doc_type", 10) 
      table.string("stext", 100) 
      table.string("doc_number", 100) 
      table.string("issue_date") 
      table.string("effective_date") 
      table.string("company_code", 10) 
      table.string("created_by", 50)
      table.timestamp('created_at', { useTz: true })
      table.string("last_updated_by", 50) 
      table.timestamp('last_updated_date', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
