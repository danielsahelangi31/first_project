import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import AsetDetail from './AsetDetail';
import AsetBuktiKepemilikan from './AsetBuktiKepemilikan';
import AsetDetailPengelolaan from './AsetDetailPengelolaan';
import AsetProsesHukum from './AsetProsesHukum';
import AsetKjpp from './AsetKjpp';
import AsetStatusPengelolaan from './AsetStatusPengelolaan';
import AsetInformasiPenyewaan from './AsetInformasiPenyewaan';
import AsetInformasiPbb from './AsetInformasiPbb';
import AsetAsuransi from './AsetAsuransi';
import AsetUsulanPenghapusan from './AsetUsulanPenghapusan';
export default class AsetHeader extends BaseModel {
public static $table = 'aset_headers';

  @column({ isPrimary: true })
  public id: string;

  @column()
  public no_aset: number;

  @column()
  public nama_aset: string;

  @column()
  public aset_kelas: string;

  @column()
  public nama_cabang: string;

  @column()
  public tgl_perolehan: Date;

  @column()
  public akumulasi_penyusutan: string;

  @column()
  public status: string;

  @column()
  public hrg_perolehan: string;

  @column()
  public nilai_buku: string;

  @column()
  public qrcode: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(AsetHeader: AsetHeader) {
    AsetHeader.id = uuidv4();
    AsetHeader.created_at = new Date();
  }

  @beforeUpdate() 
  public static async genUpdateAt(AsetHeader: AsetHeader) {
    AsetHeader.updated_at = new Date();
  }

  @hasOne(() => AsetDetail, {foreignKey: "header_id"})
  public asetDetail : HasOne<typeof AsetDetail>

  @hasMany(() => AsetBuktiKepemilikan, {foreignKey: "header_id"})
  public asetBuktiKepemilikan : HasMany<typeof AsetBuktiKepemilikan> 

  @hasOne(() => AsetDetailPengelolaan, {foreignKey: "header_id"})
  public asetDetailPengelolaan : HasOne<typeof AsetDetailPengelolaan>

  @hasOne(() => AsetProsesHukum, {foreignKey: "header_id"})
  public asetProsesHukum : HasOne<typeof AsetProsesHukum>

  @hasMany(() => AsetKjpp, {foreignKey: "header_id"})
  public asetKjpp : HasMany<typeof AsetKjpp> 

  @hasOne(() => AsetStatusPengelolaan, {foreignKey : "header_id"})
  public asetStatusPengelolaan : HasOne<typeof AsetStatusPengelolaan>

  @hasMany(() => AsetInformasiPenyewaan, {foreignKey : "header_id"})
  public asetInformasiPenyewaan : HasMany<typeof AsetInformasiPenyewaan>

  @hasOne(() => AsetInformasiPbb, {foreignKey : "header_id"})
  public asetInformasiPbb : HasOne<typeof AsetInformasiPbb>

  @hasOne(() => AsetAsuransi, {foreignKey : "header_id"})
  public asetAsuransi : HasOne<typeof AsetAsuransi>

  @hasOne(() => AsetUsulanPenghapusan, {foreignKey : "header_id"})
  public asetUsulanPenghapusan : HasOne<typeof AsetUsulanPenghapusan>
}
