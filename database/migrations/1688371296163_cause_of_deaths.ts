import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cause_of_death'

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
      table.string('asal', 20)
      table.string('kj', 2)
      table.string('golongan', 2)
      table.date('gbdat')
      table.string('carto', 40)
      table.string('cdeat', 10)
      table.date('death')
      table.string('caude', 20)
      table.string('caude_desc', 255)
      table.string('docnr', 40)
      table.string('org_path', 255)
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
