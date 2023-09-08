import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CustomerTypes extends BaseSchema {
  protected tableName = 'customer_types'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name_type',255).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
       table.timestamp('created_at', { useTz: true }).nullable()
       table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
