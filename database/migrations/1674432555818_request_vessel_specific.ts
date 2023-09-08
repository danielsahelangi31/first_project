import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_vessel_specifics'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.decimal('kp_gt').nullable()
      table.decimal('kp_dwt').nullable()
      table.decimal('kp_brt').nullable()
      table.decimal('kp_nrt').nullable()
      table.decimal('kp_loa').nullable()
      table.decimal('kp_lebar').nullable()
      table.decimal('kp_tinggi').nullable()
      table.decimal('dr_maximum').nullable()
      table.decimal('dr_depan').nullable()
      table.decimal('dr_belakang').nullable()
      table.decimal('max_speed').nullable()
      table.decimal('jm_palka').nullable()
      table.decimal('jm_derek').nullable()
      table.string('jn_derek',100).nullable()
      table.uuid('request_vessel_id');
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
