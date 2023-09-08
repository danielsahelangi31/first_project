import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'dermagas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('nama_pelabuhan').nullable()
      table.string('nama_terminal').nullable()
      table.string('nama_dermaga').nullable()
      table.string('jenis_dermaga').nullable()
      table.string('jenis_konstruksi').nullable()
      table.string('pemilik').nullable()
      table.string('status_milik').nullable()
      table.string('kode_area_labuh').nullable()
      table.string('jenis_perairan').nullable()
      table.string('tipe_layanan_utama').nullable()
      table.string('zonasi').nullable()
      table.integer('layanan_labuh').nullable()
      table.integer('layanan_tambat').nullable()
      table.float('longitude').nullable()
      table.float('latitude').nullable()
      table.string('kode_dermaga_inaportnet').nullable()
      table.float('panjang').nullable()
      table.float('lebar').nullable()
      table.float('kade_meter_awal').nullable()
      table.float('kade_meter_akhir').nullable()
      table.float('kedalaman_minimal').nullable()
      table.float('kedalaman_maximal').nullable()
      table.float('elevasi_dermaga_minimal').nullable()
      table.float('elevasi_dermaga_maximal').nullable()
      table.float('jarak_station_tunda').nullable()
      table.float('jarak_station_pandu').nullable()
      table.float('overhang_at_start').nullable()
      table.float('overhang_at_end').nullable()
      table.string('request_number').nullable()
      table.string('submitter').nullable()
      table.string('master_type_id').nullable()
      table.string('entity_id').nullable()
      table.string('schema_id').nullable()
      table.string('reference_id').nullable()
      table.integer('resubmit').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
