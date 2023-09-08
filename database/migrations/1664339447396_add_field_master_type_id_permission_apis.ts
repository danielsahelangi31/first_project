import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "permission_apis";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.uuid("master_type_id");
      table.foreign('master_type_id').references('id').inTable('master_types').onDelete('CASCADE').withKeyName('master_type_permission_api_fk')
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
