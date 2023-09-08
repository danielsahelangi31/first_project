import { v4 as uuidv4 } from 'uuid';
import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm';
// import Database from '@ioc:Adonis/Lucid/Database';

export default class AlatApung extends BaseModel {
  public static table = 'alatapungs'; 
  
  @column({ isPrimary: true })
  public id: string

  @column()
  public request_number: string
  
  @column()
  public entity: string
  
  @column()
  public kepemilikan_aset: string
  
  @column()
  public kode_aset: string
  
  @column()
  public lokasi_kepemilikan: string
  
  @column()
  public lokasi_fisik: string
  
  @column()
  public klasifikasi: string
  
  @column()
  public jenis_kapal: string
  
  @column()
  public kode_jenis: string
  
  @column()
  public nama_kapal: string
  
  @column()
  public equipment_description: string
  
  @column()
  public notes: string
  
  @column()
  public kode_alat: string
  
  @column()
  public local_asset_number: string

  @column()
  public manufacturer: string
  
  @column()
  public country_of_origin: string
  
  @column()
  public manufacturer_year: number

  @column()
  public acquisition_year: number

  @column()
  public tipe_me: string

  @column()
  public daya_me: string

  @column()
  public tipe_ae: string

  @column()
  public daya_ae: string

  @column()
  public jenis_propulsi: string

  @column()
  public merk_propulsi: string

  @column()
  public status: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @column()
  public submitter: string
  
  @column()
  public entity_id: string
  
  @column()
  public master_type_id: string
  
  @column()
  public schema_id: string
  
  @column()
  public reference_id: string
  
  @column()
  public resubmit: number
  
  @column()
  public jumlah_ae: string
  
  @column()
  public jumlah_me: string
  
  @column()
  public file_grosse_akta: string
  
  @column()
  public file_bast: string
  
  @column()
  public file_lampiran_teknis: string
  
  @column()
  public file_spesifikasi_detail_kapal: string

  @beforeCreate()
  public static async setId(AlatApung: AlatApung) {
    AlatApung.id = uuidv4();
    AlatApung.created_at = new Date();

    // generate request number 
    // const tanggal = new Date();
    // let strTanggal = tanggal.toString();
    // const strDay = strTanggal.substring(8, 10);
    // let bulanChar = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
    //                 "Aug", "Sep", "Oct", "Nov", "Dec"];
    // let bulan;
    // for(let i = 0; i < bulanChar.length; i++) {
    //     if(strTanggal.substring(4,7) == bulanChar[i]) {
    //         bulan = (i+1);
    //     }
    // }
    // const year = strTanggal.substring(11,15);
    // const resultDate = year + bulan + strDay;
    // const totalPerDay = await Database.rawQuery(`SELECT count(*) + 1 as "total" from "alatapungs" where TRUNC("created_at") = TRUNC(SYSDATE)`);
    // const runNum = '000'.substr( String(totalPerDay[0].total).length ) + (totalPerDay[0].total);
    // AlatApung.request_number = `ALATAP${resultDate}${runNum}`;
  }

  @beforeUpdate()
  public static async dateUpdate(AlatApung: AlatApung) {
    AlatApung.updated_at = new Date();
  }
}
