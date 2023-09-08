import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'schema_aplications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary();
      table.string('schema_name')
      table.uuid('master_type_id')
      table.uuid('role_id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
       table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
