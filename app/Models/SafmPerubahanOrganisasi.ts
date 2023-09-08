import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class SafmPerubahanOrganisasi extends BaseModel {
  public static table = 'safm_perubahan_organisasi'
  public static primaryKey = 'pernr'

  @column()
  public pernr: string

  @column()
  public company_code: string
  
  @column()
  public cname: string
  
  @column()
  public pnalt: string
  
  @column()
  public werks: string
  
  @column()
  public pbtxt: string
  
  @column()
  public btrtl: string

  @column()
  public btrtx: string

  @column()
  public ansvh: string

  @column()
  public anstx: string

  @column()
  public persg: string

  @column()
  public pgtxt: string

  @column()
  public persk: string

  @column()
  public pktxt: string

  @column()
  public trfg0: string

  @column()
  public trfs0: string

  @column()
  public gol: string

  @column()
  public gol_mkg: string

  @column()
  public short: string

  @column()
  public plans: string

  @column()
  public direk: string

  @column()
  public direk_text: string

  @column()
  public subdi: string

  @column()
  public subdi_text: string

  @column()
  public seksi: string

  @column()
  public seksi_text: string

  @column()
  public subsi: string

  @column()
  public subsi_text: string

  @column()
  public plvar: string

  @column()
  public program_name: string

  @column()
  public kd_aktif: string

  @column()
  public begda: Date

  @column()
  public enda: Date

  @column()
  public pin: string

  @column()
  public begda_pin: Date

  @column()
  public endda_pin: Date

  @column()
  public werks_pin: string

  @column()
  public cost_center: string

  @column()
  public lo_id: string

  @column()
  public bank_key: string

  @column()
  public bank_name: string

  @column()
  public bank_account: string

  @column()
  public pnalt_new: string

  @column()
  public werks_new: string

  @column()
  public pbtxt_new: string

  @column()
  public btrtl_new: string

  @column()
  public btrtx_new: string

  @column()
  public payscaletype: string

  @column()
  public payscaletypetext: string

  @column()
  public payrollarea: string

  @column()
  public payrollareatext: string

  @column()
  public travelcostcenter: string

  @column()
  public tmtmulaibekerja: Date
  
  @column()
  public tmtdiangkatpegawai: Date

  @column()
  public tmtkelasjabatan: Date

  @column()
  public tmtjabatan: Date

  @column()
  public tmtpensiun: Date

  @column()
  public generaltextorg: string

  @column()
  public generaltextpos: string

  @column()
  public general_text_pos: string

  @column()
  public tmt_golongan: Date

  @column()
  public nomor_sk: string

  @column()
  public tanggal_sk: Date

  @column()
  public posisi_2021: string

  @column()
  public kjposisi_2021: string

  @column()
  public tmt_periodik: Date

  @column()
  public jobid: string
  
  @column()
  public jobname: string

  @column()
  public kj_posisi: string

  @column()
  public kj_posisi_new: string

  @column()
  public kj_new: string

  @column()
  public job_point: string

  @column()
  public jenis_pekerja: string

  @column()
  public persg_parent_consol: string

  @column()
  public persk_parent_consol: string

  @column()
  public persg_child_consol: string

  @column()
  public persk_child_consol: string

  @column()
  public empstat_parent_consol: string

  @column()
  public empstat_child_consol: string

  @column()
  public trfg0_source: string

  @column()
  public trfs0_source: string
  
  @column()
  public created_by: string

  @column()
  public last_updated_by: string

  @column()
  public created_date: Date

  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createdDate(data: SafmPerubahanOrganisasi) {
    data.created_date = new Date();
  }

  @beforeUpdate()
  public static async updatedDate(data: SafmPerubahanOrganisasi) {
    data.last_updated_date = new Date();
  }
}
