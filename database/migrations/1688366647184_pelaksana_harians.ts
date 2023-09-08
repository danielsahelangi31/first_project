import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pelaksana_harian'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('pernr', 8)
      table.string('nipp', 12)
      table.string('cname', 80)
      table.string('subty', 4)
      table.string('subty_txt', 25)
      table.date('begda')
      table.date('endda')
      table.string('plans', 8)
      table.string('plans_txt', 25)
      table.string('dpernr', 8)
      table.string('dnipp', 12)
      table.string('dcname', 80)
      table.string('dplans', 8)
      table.string('dplans_txt', 25)
      table.string('workitem_id', 12)
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
