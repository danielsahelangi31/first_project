import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jenis_dermagas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
