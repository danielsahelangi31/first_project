import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'permission_user_api'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('permission_api_id').references('id').inTable('permission_apis').onDelete('CASCADE').withKeyName('permissionapifk')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
