import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetAsuransi extends BaseModel {
    static get table() {
        return "aset_asuransi";
    }
    
    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public rincian: string;

    @column()
    public no_polis: string;

    @column()
    public tgl_asuransi: string;

    @column()
    public scan_polis: string;

    @column()
    public nilai_premi: string;

    @column()
    public waktu_keterangan: string;

    @column()
    public alasan_tidak_asuransi: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetAsuransi: AsetAsuransi) {
        AsetAsuransi.id = uuidv4();
        AsetAsuransi.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetAsuransi: AsetAsuransi) {
        AsetAsuransi.updated_at = new Date();
    }
}
