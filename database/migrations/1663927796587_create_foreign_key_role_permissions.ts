import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_permissions'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("permission_id").references("id").inTable("permissions").onDelete("CASCADE").withKeyName('permissionIdForeign');
      table.foreign("role_id").references("id").inTable("roles").onDelete("CASCADE").withKeyName('roleIdForeign');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
