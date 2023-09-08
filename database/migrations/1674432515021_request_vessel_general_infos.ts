import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_vessel_general_infos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('kd_kapal').nullable()
      table.string('kd_history_kapal').nullable()
      table.string('kd_kapal_inaportnet').nullable()
      table.string('nm_kapal',255).nullable()
      table.string('kd_nm_kapal',4).nullable()
      table.string('call_sign',7).nullable()
      table.bigint('no_imo').nullable()
      table.string('mmsi',10).nullable()
      table.string('nm_pemilik',255).nullable()
      table.string('nm_pemilik_lama',255).nullable()
      table.text('catatan_jn_kapal').nullable()
      table.string('jn_pelayaran',50).nullable()
      table.string('trayek',50).nullable()
      table.string('st_kapal',50).nullable()
      table.integer('th_pembuatan',4).nullable()
      table.string('no_tanda_pendaftaran',100).nullable()
      table.uuid('country_id').nullable()
      table.uuid('vessel_type_id').nullable()
      table.uuid('vessel_type_additional_id').nullable()
      table.string('status',10).nullable()
      table.uuid('submitter').nullable()
      table.uuid('entity_id').nullable()
      table.uuid('master_type_id').nullable()
      table.uuid('schema_id').nullable()
      table.string('no_request',20).nullable()
      table.uuid('reference_id').nullable()

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
