import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'safm_pegawai'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('pernr', 8)
      table.string('cname', 80)
      table.string('pnalt', 12).nullable()
      table.string('gesch', 1).nullable()
      table.string('gende', 6).nullable()
      table.string('gbort', 40).nullable()
      table.date('gbdat').nullable()
      table.string('famst', 1).nullable()
      table.string('fatxt', 6).nullable()
      table.string('icnum', 50).nullable()
      table.string('taxid', 20).nullable()
      table.string('marrd', 1).nullable()
      table.string('depnd', 2).nullable()
      table.string('officmail', 50).nullable()
      table.string('phnumber', 30).nullable()
      table.timestamp('created_date', { useTz: true })
      table.string('created_by', 30).nullable()
      table.timestamp('last_updated_date', { useTz: true })
      table.string('last_updated_by', 30).nullable()
      table.string('program_name', 30).nullable()
      table.string('kd_aktif', 1).nullable()
      table.string('pnalt_new', 12).nullable()
      table.string('company_code', 10).nullable()
      table.string('payscaletype', 2).nullable()
      table.string('payscaletypetext', 20).nullable()
      table.string('payrollarea', 2).nullable()
      table.string('payrollareatext', 20).nullable()
      table.string('contracttype', 2).nullable()
      table.string('contracttypetext', 20).nullable()
      table.string('bloodtype', 2).nullable()
      table.string('socialmedia', 241).nullable()
      table.string('religion', 2).nullable()
      table.string('religiontext', 25).nullable()
      table.date('tmtmulaibekerja').nullable()
      table.date('tmtdiangkatpegawai').nullable()
      table.date('tmtkelasjabatan').nullable()
      table.date('tmtjabatan').nullable()
      table.date('tmtpensiun').nullable()
      table.string('bpjsketenagakerjaan', 20).nullable()
      table.string('bpjskesehatan', 20).nullable()
      table.string('tanggungan', 2).nullable()
      table.string('passpor', 30).nullable()
      table.string('privatemail', 300).nullable()
      table.string('title', 50).nullable()
      table.string('title2', 50).nullable()
      table.string('addtitle', 50).nullable()
      table.string('ethnicity', 100).nullable()
      table.date('tmt_golongan').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
