import { BaseModel, beforeCreate, beforeUpdate, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import RequestCustomerExpDocument from './RequestCustomerExpDocument';

export default class RequestCustomerDocument extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public spmp: string;

  @column()
  public ket_domisili: string;

  @column()
  public ktp_pemimpin_perusahaan: string;

  @column()
  public ktp_pic: string;

  @column()
  public siupal_siupkk: string;

  @column()
  public siupbm: string;

  @column()
  public siup_nib: string;

  @column()
  public pmku: string;

  @column()
  public akta_perusahaan: string;

  @column()
  public ref_bank: string;

  @column()
  public npwp: string;

  @column()
  public pkp_non_pkp: string;

  @column()
  public rek_asosiasi: string;

  @column()
  public sktd: string;

  @column()
  public cor_dgt: string;

  @column()
  public surat_izin_pengelolaan: string;

  @column()
  public skpt: string;

  @column()
  public siopsus: string;

  @column()
  public request_customer_id: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;
  @beforeCreate()
  public static async genCreatedAt(RequestCustomerDocument: RequestCustomerDocument) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerDocument.created_at = timestamp;
    RequestCustomerDocument.updated_at = timestamp;
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestCustomerDocument: RequestCustomerDocument) {
    let date = new Date();
    date.setHours(date.getHours()+7);
    let timestamp = date;
    RequestCustomerDocument.updated_at = timestamp;
  }

  @beforeCreate()
  public static async uuid(RequestCustomerDocument: RequestCustomerDocument) {
    RequestCustomerDocument.id = uuidv4();
  }

  @hasOne(()=> RequestCustomerExpDocument, {foreignKey: "customer_document_id"})
  public expDocument : HasOne<typeof RequestCustomerExpDocument>
}
