import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'customer_documents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('spmp',100).nullable()
      table.string('ket_domisili',100).nullable()
      table.string('ktp_pemimpin_perusahaan',100).nullable()
      table.string('ktp_pic',100).nullable()
      table.string('siupal_siupkk',100).nullable()
      table.string('siupbm',100).nullable()
      table.string('siup_nib',100).nullable()
      table.string('pmku',100).nullable()
      table.string('akta_perusahaan',100).nullable()
      table.string('ref_bank',100).nullable()
      table.string('npwp',100).nullable()
      table.string('pkp_non_pkp',100).nullable()
      table.string('rek_asosiasi',100).nullable()
      table.string('sktd',100).nullable()
      table.string('cor_dgt',100).nullable()
      table.string('surat_izin_pengelolaan',100).nullable()
      table.string('skpt',100).nullable()
      table.string('siopsus',100).nullable()
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
