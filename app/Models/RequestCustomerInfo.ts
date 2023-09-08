import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import BentukUsaha from './BentukUsaha';
import Cabang from './Cabang';
import Country from './Country';
import CustomerGroup from './CustomerGroup';
import CustomerType from './CustomerType';
import PivotCargoOwner from './PivotCargoOwner';
import PivotServiceType from './PivotServiceType';
import PivotShippingLine from './PivotShippingLine';
import PivotUsahaMitra from './PivotUsahaMitra';
import PivotUsahaPelanggan from './PivotUsahaPelanggan';
import PostalCode from './PostalCode';
import RequestCustomerBilling from './RequestCustomerBilling';
import RequestCustomerContact from './RequestCustomerContact';
import RequestCustomerDocument from './RequestCustomerDocument';
import RequestCustomerNpwp from './RequestCustomerNpwp';
import User from './User';

export default class RequestCustomerInfo extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public no_customer: string

  @column()
  public no_affiliasi: string

  @column()
  public nm_perusahaan: string

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public address: string

  @column()
  public nm_pemimpin: string

  @column()
  public parent_customer: string

  @column()
  public principle: string

  @column()
  public join_date: Date

  @column()
  public establish_date: Date

  @column()
  public birthday_date: Date

  @column()
  public birthday_pemimpin_date: Date

  @column()
  public group_customer_id: string

  @column()
  public customer_type_id: string

  @column()
  public bentuk_usaha_id: string

  @column()
  public country_id: string

  @column()
  public area_id: string

  @column()
  public branch_id: string

  @column()
  public is_bebas_pajak: number

  @column()
  public tp_company: number

  @column()
  public tp_nm_perusahaan: number

  @column()
  public sap_code: string

  @column()
  public no_pmku: string

  @column()
  public no_sktd: string

  @column()
  public status: string

  @column()
  public flag_mdm_r3: number | null

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
  public reference_id: string

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(RequestCustomerInfo: RequestCustomerInfo) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerInfo.created_at = timestamp;
    RequestCustomerInfo.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestCustomerInfo: RequestCustomerInfo) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerInfo.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(RequestCustomerInfo: RequestCustomerInfo) {
    RequestCustomerInfo.id = uuidv4();
  }

  @belongsTo(() => User, { foreignKey: "submitter" })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => CustomerType, { foreignKey: "customer_type_id"} )
  public customerType: BelongsTo<typeof CustomerType>

  @belongsTo(() => CustomerGroup, { foreignKey: "group_customer_id"} )
  public customerGroup : BelongsTo<typeof CustomerGroup>

  @belongsTo(() => BentukUsaha, { foreignKey: "bentuk_usaha_id"} )
  public bentukUsaha : BelongsTo<typeof BentukUsaha>

  @belongsTo(() => Country, { foreignKey: "country_id"} )
  public country : BelongsTo<typeof Country>

  @belongsTo(() => PostalCode, { foreignKey: "area_id"} )
  public postalCode : BelongsTo<typeof PostalCode>

  @belongsTo(() => Cabang, { foreignKey: "branch_id"} )
  public branch : BelongsTo<typeof Cabang>

  @hasOne(()=> RequestCustomerNpwp, {foreignKey: "request_customer_id"})
  public npwp : HasOne<typeof RequestCustomerNpwp>

  @hasOne(()=> RequestCustomerDocument, {foreignKey: "request_customer_id"})
  public document : HasOne<typeof RequestCustomerDocument>

  @hasMany(()=> RequestCustomerContact, {foreignKey: "request_customer_id"})
  public contact : HasMany<typeof RequestCustomerContact>

  @hasMany(()=> RequestCustomerBilling, {foreignKey: "request_customer_id"})
  public billing : HasMany<typeof RequestCustomerBilling>

  @hasMany(()=> PivotCargoOwner, {foreignKey: "request_customer_id"})
  public cargoOwner : HasMany<typeof PivotCargoOwner>

  @hasMany(()=> PivotShippingLine, {foreignKey: "request_customer_id"})
  public shippingLine : HasMany<typeof PivotShippingLine>

  @hasMany(()=> PivotServiceType, {foreignKey: "request_customer_id"})
  public serviceType : HasMany<typeof PivotServiceType>

  @hasMany(()=> PivotUsahaMitra, {foreignKey: "request_customer_id"})
  public mitra : HasMany<typeof PivotUsahaMitra>

  @hasMany(()=> PivotUsahaPelanggan, {foreignKey: "request_customer_id"})
  public usahaPelanggan : HasMany<typeof PivotUsahaPelanggan>

}
