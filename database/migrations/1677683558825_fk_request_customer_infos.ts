import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_customer_infos'

  public async up () {
    this.schema.alterTable(this.tableName,(table)=>{
      table.foreign('customer_type_id').references('id').inTable('customer_types')
      table.foreign('group_customer_id').references('id').inTable('customer_groups')
      table.foreign('bentuk_usaha_id').references('id').inTable('bentuk_usahas')
      table.foreign('area_id').references('id').inTable('postal_codes')
    })

  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
