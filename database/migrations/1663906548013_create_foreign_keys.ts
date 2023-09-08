import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "role_permissions";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("menu_id").references("id").inTable("menus").onDelete("CASCADE");
    });


  }


  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
