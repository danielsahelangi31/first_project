import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'aset_informasi_pbb'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id");
      table.uuid("header_id").unsigned().references("id").inTable("aset_headers").onDelete("CASCADE");
      table.string("no_pbb");
      table.string("nilai_njop");
      table.string("nilai_pbb");
      table.date("tgl_pbb");
      table.text("keterangan");
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
