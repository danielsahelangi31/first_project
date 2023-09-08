import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_customer_npwps'

  public async up () {
    this.schema.alterTable(this.tableName,(table)=>{
      table.foreign('request_customer_id').references('id').inTable('request_customer_infos').onDelete('CASCADE')
    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
