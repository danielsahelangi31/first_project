import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Regional from "App/Models/Regional";
import PostalCode from "App/Models/PostalCode";
import KelasPelabuhan from "./KelasPelabuhan";
import JenisPelabuhan from "./JenisPelabuhan";
import PerairanPelabuhan from "./PerairanPelabuhan";
import CountryCode from "./CountryCode";
import HeaderBranch from "App/Models/HeaderBranch";
import City from "./City";
import MasterCompany from "App/Models/MasterCompany";
import Cabang from "App/Models/Cabang";
import KodePerairan from "App/Models/KodePerairan";

export default class Branch extends BaseModel {
  public static table = "branches";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public regional_id: string;

  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public luas_perairan: string;

  @column()
  public luas_daratan: string;

  @column()
  public kode_area_pelabuhan: string;

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
  public header_branch_id: string;

  @column()
  public request_no: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @column()
  public status: string;

  @column()
  public rencana_induk_file: string;

  @column()
  public isedit: number

  @column()
  public panjang_alur: string;


  @column()
  public lebar_alur: string;


  @column()
  public address: string;

  @beforeCreate()
  public static async genCreatedAt(Branch: Branch) {
    Branch.created_at = new Date();
  }

  @beforeCreate()
  public static async setStatus(Branch: Branch) {
    Branch.status = 'ACTIVE';
  }

  @beforeUpdate()
  public static async genUpdatedAt(Branch: Branch) {
    Branch.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(Branch: Branch) {
    Branch.id = uuidv4();
  }

  @belongsTo(() => Regional, { foreignKey: "regional_id" })
  public regional: BelongsTo<typeof Regional>;

  @belongsTo(() => PostalCode, { foreignKey: "postalcode_id" })
  public postalcode: BelongsTo<typeof PostalCode>;

  @belongsTo(() => KelasPelabuhan, { foreignKey: "kelas_pelabuhan_id" })
  public kelaspelabuhan: BelongsTo<typeof KelasPelabuhan>;

  @belongsTo(() => JenisPelabuhan, { foreignKey: "jenis_pelabuhan_id" })
  public jenispelabuhan: BelongsTo<typeof JenisPelabuhan>;

  @belongsTo(() => PerairanPelabuhan, { foreignKey: "perairan_pelabuhan_id" })
  public perairanpelabuhan: BelongsTo<typeof PerairanPelabuhan>;

  @belongsTo(() => CountryCode, { foreignKey: "port_code" })
  public portCode: BelongsTo<typeof CountryCode>;

  @belongsTo(() => City, { foreignKey: "port_code" })
  public city: BelongsTo<typeof City>;

  @belongsTo(() => Cabang, { foreignKey: "header_branch_id" })
  public company: BelongsTo<typeof Cabang>;

  @belongsTo(() => KodePerairan, { foreignKey: "kode_perairan" })
  public kodePerairan: BelongsTo<typeof KodePerairan>;
}
