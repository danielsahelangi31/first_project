import { BaseModel, column,beforeCreate,beforeUpdate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import JenisSuratUkur from './JenisSuratUkur';

export default class VesselSupportDocument extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public no_surat_ukur: string

  @column()
  public no_ppka: string

  @column()
  public no_ppkm: string

  @column()
  public jn_surat_ukur: string

  @column()
  public surat_ukur: string

  @column()
  public surat_ppka: string

  @column()
  public surat_ppkm: string

  @column()
  public surat_mmsi: string

  @column()
  public tgl_terbit_ppka: Date | null;

  @column()
  public tgl_berlaku_ppka: Date | null;

  @column()
  public tgl_terbit_ppkm: Date | null;

  @column()
  public tgl_berlaku_ppkm: Date | null;

  @column()
  public tgl_surat_ukur: Date | null;

  @column()
  public vessel_id: string;

  @column()
  public surat_pendaftaran: string;

  @column()
  public created_at: Date;
  
  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(VesselSupportDocument: VesselSupportDocument) {
    VesselSupportDocument.created_at = new Date();
    VesselSupportDocument.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(VesselSupportDocument: VesselSupportDocument) {
    VesselSupportDocument.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(VesselSupportDocument: VesselSupportDocument) {
    VesselSupportDocument.id = uuidv4();
  }

  @belongsTo(() =>  JenisSuratUkur, {foreignKey: "jn_surat_ukur"})
  public jenisSuratUkur : BelongsTo <typeof JenisSuratUkur>
}
