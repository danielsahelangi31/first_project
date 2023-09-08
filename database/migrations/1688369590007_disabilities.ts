import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'disability'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('pernr', 8)
      table.string('nipp', 12)
      table.string('gender', 10)
      table.date('tmt_mulai')
      table.string('persg', 1)
      table.string('persg_txt', 20)
      table.string('persk', 2)
      table.string('persk_txt', 20)
      table.string('werks', 4)
      table.string('werks_txt', 30)
      table.string('btrtl', 4)
      table.string('btrtl_txt', 15)
      table.string('plans', 8)
      table.string('plans_txt', 25)
      table.string('ansvh', 2)
      table.string('ansvh_txt', 15)
      table.date('exdat')
      table.string('disab', 10)
      table.string('disab_txt', 25)
      table.text('disab_desc')
      table.text('org_path')
      table.string('company_code', 4)
      table.string('created_by', 30)
      table.string('last_updated_by', 30)
      table.date('created_date')
      table.date('last_updated_date')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      // table.timestamp('created_at', { useTz: true })
      // table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
