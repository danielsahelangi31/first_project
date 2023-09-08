import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm';

export default class SafmPegawai extends BaseModel {
  public static table = 'safm_pegawai';
  public static primaryKey = 'pernr';
  
  @column()
  public pernr: string
  
  @column()
  public company_code: string
  
  @column()
  public cname: string
  
  @column()
  public pnalt: string
  
  @column()
  public gesch: string
  
  @column()
  public gende: string
  
  @column()
  public gbort: string
  
  @column()
  public gbdat: Date
  
  @column()
  public famst: string
  
  @column()
  public fatxt: string
  
  @column()
  public icnum: string
  
  @column()
  public taxid: string
  
  @column()
  public marrd: string
  
  @column()
  public depnd: string
  
  @column()
  public officmail: string
  
  @column()
  public phnumber: string
  
  @column()
  public program_name: string
  
  @column()
  public kd_aktif: string
  
  @column()
  public pnalt_new: string
  
  @column()
  public payscaletype: string
  
  @column()
  public payscaletypetext: string
  
  @column()
  public payrollarea: string
  
  @column()
  public payrollareatext: string
  
  @column()
  public contracttype: string
  
  @column()
  public contracttypetext: string
  
  @column()
  public bloodtype: string
  
  @column()
  public socialmedia: string
  
  @column()
  public religion: string
  
  @column()
  public religiontext: string
  
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
  public bpjsketenagakerjaan: string
  
  @column()
  public bpjskesehatan: string
  
  @column()
  public tanggungan: string
  
  @column()
  public passpor: string
  
  @column()
  public privatemail: string
  
  @column()
  public title: string
  
  @column()
  public title2: string
  
  @column()
  public addtitle: string
  
  @column()
  public ethnicity: string
  
  @column()
  public tmt_golongan: Date

  @column()
  public jenis_pekerja: string
  
  @column()
  public created_by: string
  
  @column()
  public last_updated_by: string
  
  @column()
  public created_date: Date
  
  @column()
  public last_updated_date: Date

  @beforeCreate()
  public static async createData(data: SafmPegawai) {
    data.created_date = new Date();
  }
  
  @beforeUpdate()
  public static async updateData(data: SafmPegawai) {
    data.last_updated_date = new Date();
  }
}
