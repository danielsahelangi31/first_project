import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import User from './User';
import PostalCode from './PostalCode';
import RequestVendorBankAccount from './RequestVendorBankAccount';
import JenisVendor from './JenisVendor';

export default class RequestVendorInformation extends BaseModel {
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
  public no_request: string

  @column()
  public reference_id: string | null

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(RequestVendorInformation: RequestVendorInformation) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestVendorInformation.created_at = timestamp;
    RequestVendorInformation.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestVendorInformation: RequestVendorInformation) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestVendorInformation.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(RequestVendorInformation: RequestVendorInformation) {
    RequestVendorInformation.id = uuidv4();
  }

  @belongsTo(() => User, { foreignKey: "submitter" })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => PostalCode, { foreignKey: "city_id"} )
  public postalCode : BelongsTo<typeof PostalCode>

  @belongsTo(() => JenisVendor, { foreignKey: "jn_vendor_id"} )
  public jenisVendor : BelongsTo<typeof JenisVendor>

  @hasMany(()=> RequestVendorBankAccount, {foreignKey: "request_vendor_id"})
  public bankAccount : HasMany<typeof RequestVendorBankAccount>
}
