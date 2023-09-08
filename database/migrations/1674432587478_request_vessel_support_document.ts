import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_vessel_support_documents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('no_surat_ukur',50).nullable()
      table.string('no_ppka',50).nullable()
      table.string('no_ppkm',50).nullable()
      table.string('jn_surat_ukur',50).nullable()
      table.string('surat_ukur').nullable()
      table.string('surat_ppka').nullable()
      table.string('surat_ppkm').nullable()
      table.string('surat_mmsi').nullable()
      table.date('tgl_terbit_ppka').nullable()
      table.date('tgl_berlaku_ppka').nullable()
      table.date('tgl_terbit_ppkm').nullable()
      table.date('tgl_berlaku_ppkm').nullable()
      table.uuid('request_vessel_id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
