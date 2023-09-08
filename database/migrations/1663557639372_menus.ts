import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "menus";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.uuid("parent_id");
      table.string("name", 50);
      table.string("alias", 50);
      table.string("url", 200);
      table.text("icon");
      table.integer("flag", 1);

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
