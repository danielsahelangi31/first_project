import { v4 as uuidv4 } from 'uuid'
import { BaseModel, beforeCreate, beforeUpdate, column } from '@ioc:Adonis/Lucid/Orm'

export default class AlatbmApproved extends BaseModel {
  public static table = 'alatbm_approveds';
  
  @column({ isPrimary: true })
  public id: string

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
  public id_staging: string
  
  @column()
  public file_bast: string
  
  @column()
  public file_lampiran_teknis: string
  
  @column()
  public satuan_capacity: string

  @column()
  public is_edit: number

  @beforeCreate()
  public static async setId(AlatbmApproved: AlatbmApproved) {
    AlatbmApproved.id = uuidv4();
    AlatbmApproved.created_at = new Date();
  }

  @beforeUpdate()
  public static async setDate(AlatbmApproved: AlatbmApproved) {
    AlatbmApproved.updated_at = new Date();
  }
}
