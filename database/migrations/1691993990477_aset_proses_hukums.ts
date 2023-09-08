import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aset_proses_hukum'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.uuid("header_id").unsigned().references("id").inTable("aset_headers").onDelete("CASCADE");
      table.string("no_tgl_surat");
      table.string("keterangan");
      table.string("rincian");
      table.string("scan");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).nullable();
      table.timestamp('updated_at', { useTz: true }).nullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
