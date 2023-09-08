import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_apis'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('status')
      table.uuid('approved_by')
      table.dateTime('approved_at')

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
