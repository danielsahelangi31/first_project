import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Cabang from './Cabang';
import PivotContactCustomerLocation from './PivotContactCustomerLocation';

export default class CustomerContact extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public nm_contact: string;

  @column()
  public email_contact: string;

  @column()
  public job_title: string;

  @column()
  public mobilephone: string;

  @column()
  public phone: string;

  @column()
  public address: string;

  @column()
  public location_id: string;

  @column()
  public customer_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(CustomerContact: CustomerContact) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerContact.created_at = timestamp;
    CustomerContact.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(CustomerContact: CustomerContact) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    CustomerContact.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(CustomerContact: CustomerContact) {
    CustomerContact.id = uuidv4();
  }

  @hasMany(()=> PivotContactCustomerLocation, {foreignKey: "contact_id"})
  public cabang : HasMany<typeof PivotContactCustomerLocation>

  @belongsTo(() => Cabang, { foreignKey: "location_id"} )
  public branch : BelongsTo<typeof Cabang>
}
