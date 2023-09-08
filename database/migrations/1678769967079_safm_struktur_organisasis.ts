import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_struktur_organisasi'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('plvar', 2).nullable()
      table.string('otype', 2).nullable()
      table.string('objid', 8)
      table.string('parot', 2).nullable()
      table.string('parid', 8).nullable()
      table.date('begda').nullable()
      table.date('endda').nullable()
      table.string('short', 12).nullable()
      table.string('stext', 600).nullable()
      table.date('vbeg').nullable()
      table.date('vend').nullable()
      table.integer('tlevel').nullable()
      table.string('flag_chief', 45).nullable()
      table.string('kostenstelle', 20).nullable()
      table.string('persa', 4).nullable()
      table.string('btrtl', 4).nullable()
      table.string('persg', 1).nullable()
      table.string('persk', 2).nullable()
      table.timestamp('created_date', { useTz: true })
      table.string('created_by', 30).nullable()
      table.timestamp('updated_at', { useTz: true })
      table.string('last_updated_by', 30).nullable()
      table.string('program_name', 30).nullable()
      table.string('kd_aktif', 1).nullable()
      table.string('pin', 10).nullable()
      table.string('werks', 2).nullable()
      table.string('persa_new', 4).nullable()
      table.string('btrtl_new', 4).nullable()
      table.string('company_code', 10)
      table.string('kodeunitkerja', 50).nullable()
      table.string('koderegional', 50).nullable()
      table.string('kodeactivity', 100).nullable()
      table.string('descactivity', 800).nullable()
      table.string('descbobotorganisasi', 256).nullable()
      table.string('levelorganisasi', 4).nullable()
      table.string('persareatext', 50).nullable()
      table.string('perssubareatext', 50).nullable()
      table.string('generaltext', 200).nullable()
      table.string('generaltextpar', 200).nullable()
      table.string('costcenter', 10).nullable()
      table.string('costcentertext', 40).nullable()
      table.string('chiefposition', 1).nullable()
      table.string('kode_jobstream', 100).nullable()
      table.string('desc_jobstream', 800).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
