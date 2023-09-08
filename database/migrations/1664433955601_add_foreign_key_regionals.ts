import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "regionals";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("head_office_id").references("id").inTable("head_offices").onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
