import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetUsulanPenghapusan extends BaseModel {
    static get table() {
        return "aset_usulan_penghapusan";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public no_tgl_surat: string;

    @column()
    public rincian: string;

    @column()
    public usulan_penghapusan: string;

    @column()
    public keterangan: string;

    @column()
    public scan: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetUsulanPenghapusan: AsetUsulanPenghapusan) {
        AsetUsulanPenghapusan.id = uuidv4();
        AsetUsulanPenghapusan.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetUsulanPenghapusan: AsetUsulanPenghapusan) {
        AsetUsulanPenghapusan.updated_at = new Date();
    }
}
