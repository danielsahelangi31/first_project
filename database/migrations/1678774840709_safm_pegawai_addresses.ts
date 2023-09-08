import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai_addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string("pernr", 8)  
      table.string("full_name", 80), 
      table.string("address_type", 4) 
      table.string("address_type_text", 50) 
      table.date("start_date") 
      table.date("end_date")
      table.date("change_date")
      table.string("change_by", 12)
      table.string("street_and_house_no", 30) 
      table.string("contact_name", 30)
      table.string("second_address_line", 30) 
      table.string("district", 25) 
      table.string("city", 25) 
      table.string("postal_code", 10) 
      table.string("region", 3) 
      table.string("region_text", 20) 
      table.string("country", 3) 
      table.string("country_text", 50) 
      table.string("company_code", 10) 
      table.string("created_by", 30) 
      table.string("last_updated_by", 30) 
      table.timestamp('created_date', { useTz: true }) 
      table.timestamp('last_updated_date', { useTz: true })     
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
