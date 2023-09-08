import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aset_headers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.integer("no_aset");
      table.string("nama_aset");
      table.string("aset_kelas");
      table.string("nama_cabang");
      table.date("tgl_perolehan");
      table.string("hrg_perolehan");
      table.string("akumulasi_penyusutan");
      table.string("nilai_buku");
      table.string("status");
      table.string("qrcode");

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
