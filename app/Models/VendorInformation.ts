import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import User from './User';
import PostalCode from './PostalCode';
import VendorBankAccount from './VendorBankAccount';
import JenisVendor from './JenisVendor';
import VendorPic from './VendorPic';
import VendorIncoterm from './VendorIncoterm';
import VendorDokPendukung from './VendorDokPendukung';
import VendorIjinUsaha from './VendorIjinUsaha';
import VendorLandasanHukum from './VendorLandasanHukum';
import VendorPengurus from './VendorPengurus';
import VendorSaham from './VendorSaham';
import VendorSpt from './VendorSpt';
import VendorPkp from './VendorPkp';
import VendorNeraca from './VendorNeraca';
import VendorAuditor from './VendorAuditor';
import VendorAhli from './VendorAhli';
import VendorPengalaman from './VendorPengalaman';
import VendorPeralatan from './VendorPeralatan';
import VendorSertifikatLain from './VendorSertifikatLain';
import VendorDokHistory from './VendorDokHistory';
import VendorSertifikatBadanUsaha from './VendorSertifikatBadanUsaha';

export default class VendorInformation extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public kd_vendor: string

  @column()
  public nm_perusahaan: string

  @column()
  public no_npwp: string
  
  @column()
  public address: string
  
  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public city_id: string

  @column()
  public jn_vendor_id: string

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
  public is_edit: number

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(VendorInformation: VendorInformation) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorInformation.created_at = timestamp;
    VendorInformation.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(VendorInformation: VendorInformation) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    VendorInformation.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(VendorInformation: VendorInformation) {
    VendorInformation.id = uuidv4();
  }

  @belongsTo(() => User, { foreignKey: "submitter" })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => PostalCode, { foreignKey: "city_id"} )
  public postalCode : BelongsTo<typeof PostalCode>

  @belongsTo(() => JenisVendor, { foreignKey: "jn_vendor_id"} )
  public jenisVendor : BelongsTo<typeof JenisVendor>

  @hasMany(() => VendorBankAccount, {foreignKey: "vendor_id"})
  public bankAccount : HasMany<typeof VendorBankAccount>

  @hasMany(() => VendorPic, {foreignKey: "vendor_id"})
  public pic: HasMany<typeof VendorPic>

  @hasOne(() => VendorIncoterm, {foreignKey: "vendor_id"})
  public incoterm: HasOne<typeof VendorIncoterm>

  @hasOne(() => VendorDokPendukung, {foreignKey: "vendor_id"})
  public dokPendukung: HasOne<typeof VendorDokPendukung>

  @hasMany(() => VendorIjinUsaha, {foreignKey: "vendor_id"} )
  public ijinUsaha: HasMany<typeof VendorIjinUsaha>

  @hasMany(() => VendorSertifikatBadanUsaha, {foreignKey: "vendor_id"} )
  public sertifikatBadanUsaha: HasMany<typeof VendorSertifikatBadanUsaha>

  @hasMany(() => VendorLandasanHukum, {foreignKey: "vendor_id"} )
  public landasanHukum: HasMany<typeof VendorLandasanHukum>

  @hasMany(() => VendorPengurus, {foreignKey: "vendor_id"} )
  public pengurusPerusahaan: HasMany<typeof VendorPengurus>

  @hasMany(() => VendorSaham, {foreignKey: "vendor_id"} )
  public kepemilikanSaham: HasMany<typeof VendorSaham>

  @hasOne(() => VendorPkp, {foreignKey: "vendor_id"})
  public pkp: HasOne<typeof VendorPkp>

  @hasMany(() => VendorSpt, {foreignKey: "vendor_id"})
  public spt: HasMany<typeof VendorSpt>

  @hasMany(() => VendorNeraca, {foreignKey: "vendor_id"})
  public neraca: HasMany<typeof VendorNeraca>

  @hasMany(() => VendorAuditor, {foreignKey: "vendor_id"})
  public auditor: HasMany<typeof VendorAuditor>

  @hasMany(() => VendorAhli, {foreignKey: "vendor_id"} )
  public tenagaAhli: HasMany<typeof VendorAhli>

  @hasMany(() => VendorPengalaman, {foreignKey: "vendor_id"} )
  public pengalaman: HasMany<typeof VendorPengalaman>  

  @hasMany(() => VendorPeralatan, {foreignKey: "vendor_id"} )
  public peralatan: HasMany<typeof VendorPeralatan>

  @hasMany(() => VendorSertifikatLain, {foreignKey: "vendor_id"} )
  public sertifikatLain: HasMany<typeof VendorSertifikatLain>

  @hasMany(() => VendorDokHistory, {foreignKey: "vendor_id"} )
  public historyDokumen: HasMany<typeof VendorDokHistory>
}
