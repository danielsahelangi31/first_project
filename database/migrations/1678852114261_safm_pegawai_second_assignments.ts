import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_second_assignment'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 8) 
      table.date("begda") 
      table.date("endda") 
      table.string("cname", 200) 
      table.string("massn", 5) 
      table.string("mntxt", 200) 
      table.string("massg", 5) 
      table.string("mgtxt", 200) 
      table.string("sobid", 100) 
      table.string("nama_jabatan", 200) 
      table.string("doc_type", 10) 
      table.string("stext", 100) 
      table.date("issue_date") 
      table.date("effective_date") 
      table.string("company_code", 10) 
      table.string("created_by", 50) 
      table.string("last_updated_by", 50) 
      table.timestamp('created_date', { useTz: true })
      table.timestamp('last_updated_date', { useTz: true }) 
      table.string("persa", 10) 
      table.string("pbtxt", 50) 
      table.string("btrtl", 10) 
      table.string("lgtxt", 50) 
      table.string("persg", 10) 
      table.string("pgtxt", 50) 
      table.string("persk", 10) 
      table.string("pktxt", 50) 
      table.string("orgid", 45) 
      table.string("nama_org", 200) 
      table.string("general_textorg", 200) 
      table.string("direktorat", 20) 
      table.string("direktorat_text", 500) 
      table.string("subdit", 20) 
      table.string("subdi_text", 500) 
      table.string("seksi", 20) 
      table.string("seksi_text", 500) 
      table.string("subseksi", 20) 
      table.string("subseksi_text", 500) 
      table.string("travel_cctr", 20) 
      table.string("trfar", 10) 
      table.string("tartx", 50) 
      table.date("selesai_penugasan") 
      table.string("doc_number", 100)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
