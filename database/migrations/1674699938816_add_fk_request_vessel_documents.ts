import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_vessel_support_documents'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('request_vessel_id').references('id').inTable('request_vessel_general_infos').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
