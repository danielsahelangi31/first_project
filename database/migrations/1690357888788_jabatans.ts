import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'jabatans'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('nama_jabatan')
      table.string('level')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
