import { BaseModel, column, beforeCreate, beforeUpdate, hasOne, HasOne, belongsTo, BelongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import VesselSupportDocument from './VesselSupportDocument';
import Country from './Country';
import VesselType from './VesselType';
import JenisPelayaran from './JenisPelayaran';
import StatusKapal from './StatusKapal';
import JenisSuratUkur from './JenisSuratUkur';
import VesselSpesification from './VesselSpesification';
import VesselTypeAdditional from './VesselTypeAdditional';
import VesselAdditionalPivot from './VesselAdditionalPivot';

export default class VesselGeneralInfo extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public kd_kapal: string
  
  @column()
  public kd_history_kapal: string

  @column()
  public kd_kapal_inaportnet: string

  @column()
  public nm_kapal: string

  @column()
  public nm_kapal_alias: string

  @column()
  public kd_nm_kapal: string

  @column()
  public call_sign: string

  @column()
  public no_imo: string

  @column()
  public mmsi: string

  @column()
  public nm_pemilik: string

  @column()
  public nm_pemilik_lama: string

  @column()
  public catatan_jn_kapal: string

  @column()
  public jn_pelayaran: string

  @column()
  public trayek: string

  @column()
  public st_kapal: string

  @column()
  public th_pembuatan: number

  @column()
  public no_tanda_pendaftaran: string

  @column()
  public country_id: string

  @column()
  public vessel_type_id: string

  @column()
  public vessel_type_additional_id: string

  @column()
  public status: string

  @column()
  public submitter: string

  @column()
  public entity_id: string

  @column()
  public master_type_id: string

  @column()
  public schema_id: string

  @column()
  public isedit: number

  @column()
  public status_inaportnet: string
  
  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @column()
  public submitted_by: string

  @column()
  public last_update_by: string
  
  @column()
  public submitted_date: Date

  @column()
  public last_update_date: Date

  @beforeCreate()
  public static async genCreatedAt(VesselGeneralInfo: VesselGeneralInfo) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date
    VesselGeneralInfo.created_at = timestamp;
    VesselGeneralInfo.updated_at = timestamp;
    VesselGeneralInfo.submitted_date = timestamp;
    VesselGeneralInfo.last_update_date = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VesselGeneralInfo: VesselGeneralInfo) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date
    VesselGeneralInfo.updated_at = timestamp;
    VesselGeneralInfo.last_update_date = timestamp;
  }

  @beforeCreate()
  public static async uuid(VesselGeneralInfo: VesselGeneralInfo) {
    VesselGeneralInfo.id = uuidv4();
  }

  @hasOne(()=> VesselSpesification, {foreignKey: "vessel_id"})
  public specificVessel : HasOne<typeof VesselSpesification>
  
  @hasOne(()=> VesselSupportDocument, {foreignKey: "vessel_id"})
  public supportDocumentVessel : HasOne<typeof VesselSupportDocument>

  @belongsTo(() =>  Country, {foreignKey: "country_id"})
  public kdBendera : BelongsTo <typeof Country>

  @belongsTo(() =>  VesselType, {foreignKey: "vessel_type_id"})
  public spesifikKapal : BelongsTo <typeof VesselType>

  @belongsTo(() =>  JenisPelayaran, {foreignKey: "jn_pelayaran"})
  public jenisPelayaran : BelongsTo <typeof JenisPelayaran>
  
  @belongsTo(() =>  StatusKapal, {foreignKey: "st_kapal"})
  public statusKapal : BelongsTo <typeof StatusKapal>

  @belongsTo(() =>  JenisSuratUkur, {foreignKey: "st_kapal"})
  public jenisSuratUkur : BelongsTo <typeof JenisSuratUkur>

  @belongsTo(() =>  VesselTypeAdditional, {foreignKey: "vessel_type_additional_id"})
  public VesselTypeAdditional : BelongsTo <typeof VesselTypeAdditional>

  @hasMany(() => VesselAdditionalPivot, {foreignKey: 'vessel_id'})
  public additionalInfo : HasMany<typeof VesselAdditionalPivot>
}
