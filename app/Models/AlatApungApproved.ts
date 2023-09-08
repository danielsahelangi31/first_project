import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class AlatApungApproved extends BaseModel {
  public static table = 'alatapung_approveds';
  
  @column({ isPrimary: true })
  public id: number
  
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
  public id_staging: string

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
  
  @column()
  public is_edit: number

  @beforeCreate()
  public static async setId(AlatApungApproved: AlatApungApproved) {
    AlatApungApproved.id = uuidv4();
    AlatApungApproved.created_at = new Date();
  }

  @beforeUpdate()
  public static async dateUpdate(AlatApungApproved: AlatApungApproved) {
    AlatApungApproved.updated_at = new Date(); 
  } 
}
