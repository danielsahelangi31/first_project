import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import BentukUsaha from './BentukUsaha';
import Cabang from './Cabang';
import Country from './Country';
import CustomerBilling from './CustomerBilling';
import CustomerContact from './CustomerContact';
import CustomerDocument from './CustomerDocument';
import CustomerGroup from './CustomerGroup';
import CustomerType from './CustomerType';
import CustomerNpwpv2 from './CustomerNpwpv2';
import PivotCargoOwner from './PivotCargoOwner';
import PivotServiceType from './PivotServiceType';
import PivotShippingLine from './PivotShippingLine';
import PivotUsahaMitra from './PivotUsahaMitra';
import PivotUsahaPelanggan from './PivotUsahaPelanggan';
import PostalCode from './PostalCode';
import User from './User';

export default class CustomerInfo extends BaseModel {
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
  public submitter: string

  @column()
  public entity_id: string

  @column()
  public master_type_id: string

  @column()
  public schema_id: string

  @column()
  public is_edit: number | null

  @column()
  public flag_mdm_r3: number | null

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @column()
  public submitted_by: string

  @column()
  public last_update_by: string

  @column()
  public submitted_date: Date;

  @column()
  public last_update_date: Date;

  @beforeCreate()
  public static async genCreatedAt(CustomerInfo: CustomerInfo) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerInfo.created_at = timestamp;
    CustomerInfo.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(CustomerInfo: CustomerInfo) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerInfo.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(CustomerInfo: CustomerInfo) {
    CustomerInfo.id = uuidv4();
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

  @hasOne(()=> CustomerNpwpv2, {foreignKey: "customer_id"})
  public npwp : HasOne<typeof CustomerNpwpv2>

  @hasOne(()=> CustomerDocument, {foreignKey: "customer_id"})
  public document : HasOne<typeof CustomerDocument>

  @hasMany(()=> CustomerContact, {foreignKey: "customer_id"})
  public contact : HasMany<typeof CustomerContact>

  @hasMany(()=> CustomerBilling, {foreignKey: "customer_id"})
  public billing : HasMany<typeof CustomerBilling>

  @hasMany(()=> PivotCargoOwner, {foreignKey: "customer_id"})
  public cargoOwner : HasMany<typeof PivotCargoOwner>

  @hasMany(()=> PivotShippingLine, {foreignKey: "customer_id"})
  public shippingLine : HasMany<typeof PivotShippingLine>

  @hasMany(()=> PivotServiceType, {foreignKey: "customer_id"})
  public serviceType : HasMany<typeof PivotServiceType>

  @hasMany(()=> PivotUsahaMitra, {foreignKey: "customer_id"})
  public mitra : HasMany<typeof PivotUsahaMitra>

  @hasMany(()=> PivotUsahaPelanggan, {foreignKey: "customer_id"})
  public usahaPelanggan : HasMany<typeof PivotUsahaPelanggan>

}
