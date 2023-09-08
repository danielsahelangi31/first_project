import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'customer_contacts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('nm_contact',50).nullable()
      table.string('email_contact',50).nullable()
      table.string('job_title',50).nullable()
      table.string('mobilephone',20).nullable()
      table.string('phone',20).nullable()
      table.string('address',200).nullable()
      table.uuid('location_id').nullable()
      table.uuid('customer_id').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: false }).nullable()
      table.timestamp('updated_at', { useTz: false }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
