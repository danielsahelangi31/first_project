import { DateTime } from "luxon";
import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Branch from "App/Models/Branch";
import JenisTerminal from "App/Models/JenisTerminal";
import Regional from "App/Models/Regional";
import MasterCompany from "App/Models/MasterCompany";

export default class Terminal extends BaseModel {
  public static table = "terminals";
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
  public kapasitas: string;

  @column()
  public kedalaman_max: string;

  @column()
  public kedalaman_min: string;

  @column()
  public jenis_terminal_id: string;

  @column()
  public regional_id: string;

  @column()
  public company_id: string;
  @column()
  public name_sub_wil: string;

  @column()
  public code_sub_wil: string;

  @column()
  public request_no: string;

  @column()
  public status: string;

  @column()
  public izin_operasi_file: string;

  @column()
  public bast_file: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;


  @column()
  public isedit: number


  @column()
  public address: string;

  @column()
  public lng: string;

  @column()
  public lat: string;

  @beforeCreate()
  public static async genCreatedAt(Terminal: Terminal) {
    Terminal.created_at = new Date();
  }

  @beforeCreate()
  public static async setStatus(Terminal: Terminal) {
    Terminal.status = 'ACTIVE';
  }

  @beforeUpdate()
  public static async genUpdatedAt(Terminal: Terminal) {
    Terminal.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(Terminal: Terminal) {
    Terminal.id = uuidv4();
  }

  @belongsTo(() => Branch, { foreignKey: "branch_id" })
  public branch: BelongsTo<typeof Branch>;

  @belongsTo(() =>MasterCompany , { foreignKey: "company_id" })
  public subPengelola: BelongsTo<typeof MasterCompany>;

  @belongsTo(() => JenisTerminal, { foreignKey: "jenis_terminal_id" })
  public jenisTerminal: BelongsTo<typeof JenisTerminal>;
}
