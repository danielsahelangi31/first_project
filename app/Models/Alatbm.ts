import { v4 as uuidv4 } from 'uuid';
import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm';
// import Database from '@ioc:Adonis/Lucid/Database';

export default class Alatbm extends BaseModel {
  public static table = 'alatbms'
  
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
  public class_code: string

  @column()
  public class_description: string

  @column()
  public kategori_alat: string

  @column()
  public nomor_sap: string
  
  @column()
  public local_equipment: string
      
  @column()
  public equipment_number: string

  @column()
  public manufacturer: string 
  
  @column()
  public country_origin: string

  @column()
  public manufacturer_year: number

  @column()
  public acquisition_year: number

  @column()
  public model: string
  
  @column()
  public equipment_serial: string
  
  @column()
  public kapasitas: string
  
  @column()
  public satuan_kapasitas: string
  
  @column()
  public power_source: string
  
  @column()
  public power_capacity: string
  
  @column()
  public equipment_description: string
  
  @column()
  public span: string
  
  @column()
  public outreach: string
  
  @column()
  public lifting_above: string
      
  @column()
  public lifting_below: string
  
  @column()
  public tier_type: string
      
  @column()
  public notes: string
  
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
  public file_bast: string
  
  @column()
  public file_lampiran_teknis: string
  
  @column()
  public satuan_capacity: string

  @beforeCreate()
  public static async setId(Alatbm: Alatbm) {
    Alatbm.id = uuidv4();
    Alatbm.created_at = new Date();

    // generate request number 
    // let tanggal = new Date();
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
    // let year = strTanggal.substring(11,15);
    // let resultDate = year + bulan + strDay;
    // const totalPerDay = await Database.rawQuery(`SELECT count(*) + 1 as "total" from "alatbms" where TRUNC("created_at") = TRUNC(SYSDATE)`);
    // const runNum = '000'.substr( String(totalPerDay[0].total).length ) + (totalPerDay[0].total);
    // Alatbm.request_number = `ALATBM${resultDate}${runNum}`;
  }

  @beforeUpdate()
  public static async updateDate(Alatbm: Alatbm) {
    Alatbm.updated_at = new Date();
  }

}
