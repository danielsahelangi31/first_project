import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'branches'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('regional_id').references('id').inTable('regionals').onDelete('CASCADE')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
