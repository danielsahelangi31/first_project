import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'alatbm_approveds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary() 
      table.string('entity').nullable()
      table.string('kepemilikan_aset').nullable()
      table.string('kode_aset').nullable()
      table.string('lokasi_kepemilikan').nullable()
      table.string('lokasi_fisik').nullable()
      table.string('class_code').nullable()
      table.string('class_description').nullable()
      table.string('kategori_alat').nullable()
      table.string('nomor_sap').nullable()
      table.string('local_equipment').nullable()
      table.string('equipment_number').nullable()
      table.string('manufacturer').nullable()
      table.string('country_origin').nullable()
      table.integer('manufacturer_year').nullable()
      table.integer('acquisition_year').nullable()
      table.string('model').nullable()
      table.string('equipment_serial').nullable()
      table.string('kapasitas').nullable()
      table.string('satuan_kapasitas').nullable()
      table.string('power_source').nullable()
      table.string('power_capacity').nullable()
      table.string('equipment_description').nullable()
      table.string('span').nullable()
      table.string('outreach').nullable()
      table.string('lifting_above').nullable()
      table.string('lifting_below').nullable()
      table.string('tier_type').nullable()
      table.string('notes').nullable()
      table.string('status')
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
