import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'customer_infos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('no_customer',50).nullable()
      table.string('no_affiliasi',50).nullable()
      table.string('nm_perusahaan',50).nullable()
      table.string('email',50).nullable()
      table.string('phone',30).nullable()
      table.string('address',200).nullable()
      table.string('nm_pemimpin',50).nullable()
      table.string('parent_customer',50).nullable()
      table.date('join_date').nullable()
      table.date('establish_date').nullable()
      table.date('birthday_date').nullable()
      table.date('birthday_pemimpin_date').nullable()
      table.uuid('group_customer_id').nullable()
      table.uuid('customer_type_id').nullable()
      table.uuid('bentuk_usaha_id').nullable()
      table.uuid('country_id').nullable()
      table.smallint('area_id').nullable()
      table.uuid('branch_id').nullable()
      table.integer('is_bebas_pajak',1).nullable()
      table.integer('tp_company',2).nullable()
      table.integer('tp_nm_perusahaan',1).nullable()
      table.string('sap_code',50).nullable()
      table.string('no_pmku',50).nullable()
      table.string('no_sktd',50).nullable()
      table.string('status',10).nullable()
      table.uuid('submitter').nullable()
      table.uuid('entity_id').nullable()
      table.uuid('master_type_id').nullable()
      table.uuid('schema_id').nullable()
      table.integer('is_edit',1).nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: false }).nullable()
      table.timestamp('updated_at', { useTz: false }).nullable()
      table.string('submitted_by',50).nullable()
      table.string('last_update_by',50).nullable()
      table.timestamp('submitted_date', { useTz: false }).nullable()
      table.timestamp('last_update_date', { useTz: false }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
