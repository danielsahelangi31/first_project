import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm';

export default class SafmPegawaiSecondAssignment extends BaseModel {
  public static table = 'safm_pegawai_second_assignment'; 
  public static primaryKey = 'pernr';
  
  @column()
  public pernr: string 
  
  @column()
  public company_code: string 
  
  @column()
  public begda: Date
  
  @column()
  public endda: Date
  
  @column()
  public cname: string
  
  @column()
  public massn: string

  @column()
  public mntxt: string 

  @column()
  public massg: string
  
  @column()
  public mgtxt: string 
      
  @column()
  public sobid: string
  
  @column()
  public nama_jabatan: string 
      
  @column()
  public doc_type: string 
      
  @column()
  public stext: string 
      
  @column()
  public issue_date: Date 
      
  @column()
  public effective_date: Date
  
  @column()
  public persa: string 
  
  @column()
  public pbtxt: string
  
  @column()    
  public btrtl: string 
  
  @column()
  public lgtxt: string 
  
  @column()
  public persg: string 
  
  @column()
  public pgtxt: string
  
  @column()    
  public persk: string
  
  @column()    
  public pktxt: string 
  
  @column()
  public orgid: string 
  
  @column()
  public nama_org: string 
  
  @column()
  public general_textorg: string
  
  @column()    
  public direktorat: string 
  
  @column()
  public direktorat_text: string 
  
  @column()
  public subdit: string 
  
  @column()
  public subdit_text: string 
  
  @column()
  public seksi: string 
  
  @column()
  public seksi_text: string 
  
  @column()
  public subseksi: string 
  
  @column()
  public subseksi_text: string 
  
  @column()
  public travel_cctr: string 
  
  @column()
  public trfar: string 
  
  @column()
  public tartx: string 
  
  @column()
  public selesai_penugasan: Date 
  
  @column()
  public doc_number: string
  
  @column()
  public created_by: string
  
  @column()    
  public last_updated_by: string 
  
  @column()
  public created_date: Date
  
  @column()
  public last_updated_date: Date 
  
  @beforeCreate()
  public static async setId(data: SafmPegawaiSecondAssignment) {
    data.created_date = new Date();
  }

  @beforeUpdate()
  public static async updateDate(data: SafmPegawaiSecondAssignment) {
    data.last_updated_date = new Date();
  }
}
