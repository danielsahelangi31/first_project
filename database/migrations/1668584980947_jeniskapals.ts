import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jeniskapals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('kode_jenis')
      table.string('jenis_kapal')
      table.date('insert_date').nullable()
      table.date('update_date').nullable()
      table.integer('sort_no')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
