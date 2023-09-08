import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class BranchView extends BaseModel {
  public static table = 'branches_view'
  @column({ isPrimary: true })
  public id: string;
  
  @column()
  public regional: string;

  @column()
  public name: string;

  @column()
  public luas_perairan: string;

  @column()
  public luas_daratan: string;

  @column()
  public kode_area_labuh: string;

  @column()
  public kode_perairan: string;

  @column()
  public kode_kemenhub: string;

  @column()
  public lng: string;
  
  @column()
  public lat: string;
  
  @column()
  public kedalaman_min: string;
  
  @column()
  public kedalaman_max: string;

  @column()
  public created_at: Date;

  @column()
  public country_name: string;

  @column()
  public country_code: string;

  @column()
  public province: string;

  @column()
  public postalcode_id: number;

  @column()
  public port_name: string;

  @column()
  public port_code: string;

  @column()
  public kelas_pelabuhan: string;

  @column()
  public jenis_pelabuhan: string;

  @column()
  public perairan_pelabuhan: string;
  
  @column()
  public request_no: string;

  @column()
  public header_branch: string;

  @column()
  public header_branch_code: string;

  @column()
  public status: string;
}
