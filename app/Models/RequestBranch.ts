import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Regional from "App/Models/Regional";
import PostalCode from "App/Models/PostalCode";
import CountryCode from "App/Models/CountryCode";
import KelasPelabuhan from "./KelasPelabuhan";
import JenisPelabuhan from "./JenisPelabuhan";
import PerairanPelabuhan from "./PerairanPelabuhan";
import HeaderBranch from "App/Models/HeaderBranch";
import User from "./User";
import City from "./City";
import MasterCompany from "App/Models/MasterCompany";
import Cabang from "App/Models/Cabang";
import Country from "App/Models/Country";
import ApprovalHeader from "App/Models/ApprovalHeader";
import KodePerairan from "App/Models/KodePerairan";

export default class RequestBranch extends BaseModel {
  public static table = "request_branches";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public regional_id: string;

  @column()
  public name: string;


  @column()
  public luas_perairan: string;

  @column()
  public luas_daratan: string;


  @column()
  public kode_area_labuh: string;

  @column()
  public kode_perairan: string;

  @column()
  public kode_kemenhub: string;

  @column()
  public lng: string;

  @column()
  public lat: string;

  @column()
  public kedalaman_min: string;

  @column()
  public kedalaman_max: string;

  @column()
  public country_id: string;

  @column()
  public postalcode_id: string;

  @column()
  public port_name: string;

  @column()
  public port_code: string;

  @column()
  public kelas_pelabuhan_id: string;

  @column()
  public jenis_pelabuhan_id: string;

  @column()
  public perairan_pelabuhan_id: string;

  @column()
  public request_no: string;

  @column()
  public submitter: string;

  @column()
  public master_type_id: string;

  @column()
  public entity_id: string;

  @column()
  public schema_id: string;

  @column()
  public status: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @column()
  public reference_id: string;

  @column()
  public header_branch_id: string;

  @column()
  public rencana_induk_file: string;

  @column()
  public panjang_alur: string;


  @column()
  public lebar_alur: string;


  @column()
  public address: string;
  @beforeCreate()
  public static async genCreatedAt(RequestBranch: RequestBranch) {
    RequestBranch.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestBranch: RequestBranch) {
    RequestBranch.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(Branch: RequestBranch) {
    Branch.id = uuidv4();
  }

  @belongsTo(() => Regional, { foreignKey: "regional_id" })
  public regional: BelongsTo<typeof Regional>;

  @belongsTo(() => PostalCode, { foreignKey: "postalcode_id" })
  public postalcode: BelongsTo<typeof PostalCode>;

  @belongsTo(() => CountryCode, { foreignKey: "port_code" })
  public portCode: BelongsTo<typeof CountryCode>;

  @belongsTo(() => Country, { foreignKey: "country_id" })
  public countryCode: BelongsTo<typeof Country>;

  @belongsTo(() => City, { foreignKey: "port_code" })
  public cities: BelongsTo<typeof City>;


  @belongsTo(() => KelasPelabuhan, { foreignKey: "kelas_pelabuhan_id"})
  public kelaspelabuhan: BelongsTo<typeof KelasPelabuhan>;

  @belongsTo(() => ApprovalHeader, { foreignKey: "request_no", localKey:"no_request" })
  public approvalHeader: BelongsTo<typeof ApprovalHeader>;

  @belongsTo(() => JenisPelabuhan, { foreignKey: "jenis_pelabuhan_id" })
  public jenispelabuhan: BelongsTo<typeof JenisPelabuhan>;

  @belongsTo(() => PerairanPelabuhan, { foreignKey: "perairan_pelabuhan_id" })
  public perairanpelabuhan: BelongsTo<typeof PerairanPelabuhan>;

  @belongsTo(() => MasterCompany, { foreignKey: "header_branch_id" })
  public headerBranch: BelongsTo<typeof MasterCompany>;

  @belongsTo(() => User, { foreignKey: "submitter" })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => City, { foreignKey: "port_code" })
  public city: BelongsTo<typeof City>;

  @belongsTo(() => Cabang, { foreignKey: "header_branch_id" })
  public company: BelongsTo<typeof Cabang>;

  @belongsTo(() => KodePerairan, { foreignKey: "kode_perairan" })
  public kodePerairan: BelongsTo<typeof KodePerairan>;

}
