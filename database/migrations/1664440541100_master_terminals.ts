import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "terminals";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id");
      table.uuid("branch_id");
      table.string("name");
      table.string("code");
      table.string("jumlah_tambat");
      table.string("luas");
      table.string("kapasitas");
      table.string("kedalaman_max");
      table.string("kedalaman_min");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).nullable();
      table.timestamp("updated_at", { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
