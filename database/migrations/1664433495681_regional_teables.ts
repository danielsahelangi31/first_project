import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "regionals";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.string("name");
      table.string("code");
      table.uuid("head_office_id");
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
