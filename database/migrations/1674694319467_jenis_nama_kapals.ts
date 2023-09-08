import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jenis_nama_kapals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id')
      table.string('name',2)
      table.bigInteger('kd_jenis_nama_kapal')

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
