import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetDetail extends BaseModel {
    static get table() {
        return "aset_detail";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public lokasi: string;

    @column()
    public koordinat: string;

    @column()
    public kondisi_fisik: string;

    @column()
    public tindak_lanjut: string;

    @column()
    public merek: string;

    @column()
    public tipe: string;

    @column()
    public status_perolehan: string;

    @column()
    public asuransi: string;

    @column()
    public foto_fisik_utuh: string;

    @column()
    public foto_dekat: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetDetail: AsetDetail) {
        AsetDetail.id = uuidv4();
        AsetDetail.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetDetail: AsetDetail) {
        AsetDetail.updated_at = new Date();
    }
}
