import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'dermaga_coordinates'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('id_dermaga_approved').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id_dermaga_approved')
    })

  }
}