import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cuti_sppds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('pernr', 8)
      table.string('full_name', 80)
      table.string('personel_area', 4)
      table.string('personel_sub_area', 4)
      table.string('att_absence_type', 4)
      table.string('att_type_text', 25)
      table.string('status', 12)
      table.date('start_date')
      table.date('end_date')
      table.string('plh', 8)
      table.string('plhname', 80)
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
