import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetBuktiKepemilikan extends BaseModel {
    static get table() {
        return "aset_informasi_bukti_kepemilikan";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public no_kepemilikan: string;

    @column()
    public tgl_kepemilikan: Date;

    @column()
    public waktu_berlaku: string;

    @column()
    public keterangan: string;

    @column()
    public fisik_dokumen: string;

    @column()
    public scan: string;

    @column()
    public tipe: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetBuktiKepemilikan: AsetBuktiKepemilikan) {
        AsetBuktiKepemilikan.id = uuidv4();
        AsetBuktiKepemilikan.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetBuktiKepemilikan: AsetBuktiKepemilikan) {
        AsetBuktiKepemilikan.updated_at = new Date();
    }
}
