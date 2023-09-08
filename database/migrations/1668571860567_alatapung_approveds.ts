import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'alatapung_approveds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('entity').nullable()
      table.string('kepemilikan_aset').nullable()
      table.string('kode_aset').nullable()
      table.string('lokasi_kepemilikan').nullable()
      table.string('lokasi_fisik').nullable()
      table.string('klasifikasi').nullable()
      table.string('jenis_kapal').nullable()
      table.string('kode_jenis').nullable()
      table.string('nama_kapal').nullable()
      table.string('equipment_description').nullable()
      table.string('notes').nullable()
      table.string('kode_alat').nullable()
      table.string('local_asset_number').nullable()
      table.string('manufacturer').nullable()
      table.string('country_of_origin').nullable()
      table.integer('manufacturer_year').nullable()
      table.integer('acquisition_year').nullable()
      table.string('tipe_me').nullable()
      table.string('daya_me').nullable()
      table.string('tipe_ae').nullable()
      table.string('daya_ae').nullable()
      table.string('jenis_propulsi').nullable()
      table.string('merk_propulsi').nullable()
      table.string('status')
      table.timestamp('created_at', { useTz: true }).nullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
