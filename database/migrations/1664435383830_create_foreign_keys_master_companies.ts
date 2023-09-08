import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'master_company_account_numbers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("id_company_terminal").references("id").inTable("master_companies").onDelete("CASCADE");

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}