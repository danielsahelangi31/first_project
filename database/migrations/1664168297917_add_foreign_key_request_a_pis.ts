import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_apis'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("master_type_id").references("id").inTable("master_types").onDelete("CASCADE");
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
