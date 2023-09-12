import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'mbrg_header'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.integer("kode");
      table.string("kode_istc");
      table.string("nama");
      table.string("kelompok");
      table.string("komoditi");
      table.string("sifat");
      table.string("kode_imdg");
      table.string("ket_imdg");
      table.string("jns_mstambat");
      table.string("catatan");

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
