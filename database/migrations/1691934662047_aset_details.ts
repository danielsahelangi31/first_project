import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aset_detail'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.uuid("header_id").unsigned().references("id").inTable("aset_headers").onDelete("CASCADE");
      table.string("lokasi");
      table.string("koordinat");
      table.string("kondisi_fisik");
      table.string("tindak_lanjut");
      table.string("merek");
      table.string("tipe");
      table.string("status_perolehan");
      table.string("asuransi");
      table.string("foto_fisik_utuh");
      table.string("foto_dekat");

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
