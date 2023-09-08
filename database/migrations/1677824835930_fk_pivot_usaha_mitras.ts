import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'pivot_usaha_mitras'

  public async up () {
    this.schema.alterTable(this.tableName,(table)=>{
      table.foreign('customer_id').references('id').inTable('customer_infos').onDelete('CASCADE')
      table.foreign('request_customer_id').references('id').inTable('request_customer_infos').onDelete('CASCADE')
      table.foreign('mitra_id').references('id').inTable('mitras')
    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
