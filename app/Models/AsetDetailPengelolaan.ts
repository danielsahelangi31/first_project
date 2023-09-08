import { BaseModel, beforeCreate, beforeUpdate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetDetailPengelolaan extends BaseModel {
    static get table() {
        return "aset_detail_pengelolaan";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public status_pengelolaan: string;

    @column()
    public bukti_kepemilikan: string;

    @column()
    public waktu_berlaku: string;

    @column()
    public tgl_kepemilikan: Date;

    @column()
    public keterangan: string;

    @column()
    public fisik_dokumen: string;

    @column()
    public scan: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetDetailPengelolaan: AsetDetailPengelolaan) {
        AsetDetailPengelolaan.id = uuidv4();
        AsetDetailPengelolaan.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetDetailPengelolaan: AsetDetailPengelolaan) {
        AsetDetailPengelolaan.updated_at = new Date();
    }
}
