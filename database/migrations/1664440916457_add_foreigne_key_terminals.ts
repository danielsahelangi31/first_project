import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'terminals'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('branch_id').references('id').inTable('branches').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
