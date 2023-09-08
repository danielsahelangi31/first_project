import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'vessel_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id')
      table.string('jn_kapal').nullable()
      table.string('tipe_kapal').nullable()
      table.string('spesifik_kapal').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: false }).nullable()
      table.timestamp('updated_at', { useTz: false }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
