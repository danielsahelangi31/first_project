import { BaseModel, beforeCreate, beforeUpdate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetInformasiPbb extends BaseModel {
    static get table() {
        return "aset_informasi_pbb";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public no_pbb: string;

    @column()
    public header_id: string;

    @column()
    public nilai_njop: string;

    @column()
    public nilai_pbb: string;

    @column()
    public tgl_pbb: string;

    @column()
    public keterangan: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetInformasiPbb: AsetInformasiPbb) {
        AsetInformasiPbb.id = uuidv4();
        AsetInformasiPbb.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetInformasiPbb: AsetInformasiPbb) {
        AsetInformasiPbb.updated_at = new Date();
    }
}
