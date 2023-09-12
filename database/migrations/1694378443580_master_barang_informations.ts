import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'mbrg_information'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid("header_id").unsigned().references("id").inTable("mbrg_header").onDelete("CASCADE");
      table.string("kemasan");
      table.string("konv_keton");
      table.string("dim_luas");
      table.string("satuan");
      table.string("kel_komoditi");
      table.string("jns_komoditi");
      table.string("kmdt_unggulan");
      table.string("sifat_barang_tkbm");
      table.string("jns_kemasan_tkbm");
      table.string("hscode");
      table.string("toeslag");
      table.string("service_group");

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
