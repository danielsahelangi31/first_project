import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'request_customer_exp_documents'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.date('exp_ket_domisili').nullable()
      table.date('exp_siupal_siupkk').nullable()
      table.date('exp_siupbm').nullable()
      table.date('exp_siup_nib').nullable()
      table.date('exp_sktd').nullable()
      table.date('exp_cor_dgt').nullable()
      table.date('exp_surat_izin_pengelolaan').nullable()
      table.date('exp_skpt').nullable()
      table.date('exp_siopsus').nullable()
      table.uuid('customer_document_id').nullable()
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
