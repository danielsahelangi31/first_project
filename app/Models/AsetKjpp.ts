import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetKjpp extends BaseModel {
    static get table() {
        return "aset_kjpp";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public tgl_kjpp: Date;

    @column()
    public nomor: string;

    @column()
    public pelaksana: string;

    @column()
    public umur_manfaat: number;

    @column()
    public nilai_wajar: number;

    @column()
    public tipe: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetKjpp: AsetKjpp) {
        AsetKjpp.id = uuidv4();
        AsetKjpp.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetKjpp: AsetKjpp) {
        AsetKjpp.updated_at = new Date();
    }
}
