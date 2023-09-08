import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'groupalats'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('kode_alat')
      table.string('deskripsi_alat')
      table.date('insert_date').nullable()
      table.date('update_date').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
