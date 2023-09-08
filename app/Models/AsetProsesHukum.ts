import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetProsesHukum extends BaseModel {
    static get table() {
        return "aset_proses_hukum";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public no_tgl_surat: string;

    @column()
    public keterangan: string;

    @column()
    public rincian: string;

    @column()
    public scan: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetProsesHukum: AsetProsesHukum) {
        AsetProsesHukum.id = uuidv4();
        AsetProsesHukum.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetProsesHukum: AsetProsesHukum) {
        AsetProsesHukum.updated_at = new Date();
    }
}
