import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'apilogs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text("package").nullable();
      table.string("userid").nullable();
      table.text("payload").nullable();
      table.string("request_id").nullable();
      table.timestamp('created_at', { useTz: true }).nullable();
      table.timestamp('updated_at', { useTz: true }).nullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
