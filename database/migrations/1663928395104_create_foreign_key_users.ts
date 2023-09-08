import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("role_id").references("id").inTable("roles").onDelete("CASCADE");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
