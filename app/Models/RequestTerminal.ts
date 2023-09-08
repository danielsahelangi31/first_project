import { v4 as uuidv4 } from "uuid";
import { BaseModel, beforeCreate, beforeSave, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Branch from "App/Models/Branch";
import JenisTerminal from "App/Models/JenisTerminal";
import MasterCompany from "App/Models/MasterCompany";
import User from "./User";
import ApprovalHeader from "App/Models/ApprovalHeader";

export default class RequestTerminal extends BaseModel {
  public static table = "request_terminals";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public branch_id: string;

  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public jumlah_tambat: string;

  @column()
  public luas: string;

  @column()
  public kedalaman_max: string;

  @column()
  public kedalaman_min: string;

  @column()
  public jenis_terminal_id: string;

  @column()
  public schema_id: string;

  @column()
  public request_no: string;

  @column()
  public master_type_id: string;

  @column()
  public entity_id: string;

  @column()
  public submitter: string;

  @column()
  public status: string;

  @column()
  public izin_operasi_file: string;

  @column()
  public bast_file: string;

  @column()
  public company_id: string;

  @column()
  public reference_id: string;


  @column()
  public name_sub_wil: string;

  @column()
  public code_sub_wil: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @column()
  public address: string;

  @column()
  public lng: string;

  @column()
  public lat: string;



  @beforeCreate()
  public static async genCreatedAt(RequestTerminal: RequestTerminal) {
    RequestTerminal.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestTerminal: RequestTerminal) {
    RequestTerminal.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(RequestTerminal: RequestTerminal) {
    RequestTerminal.id = uuidv4();
  }


  @belongsTo(() => Branch, { foreignKey: "branch_id" })
  public branch: BelongsTo<typeof Branch>;

  @belongsTo(() => MasterCompany, { foreignKey: "company_id" })
  public subPengelola: BelongsTo<typeof MasterCompany>;

  @belongsTo(() => JenisTerminal, { foreignKey: "jenis_terminal_id" })
  public jenisTerminal: BelongsTo<typeof JenisTerminal>;

  @belongsTo(() => User, { foreignKey: "submitter" })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => ApprovalHeader, { foreignKey: "request_no", localKey: "no_request" })
  public approvalHeader: BelongsTo<typeof ApprovalHeader>;
}
