import { BaseModel, beforeCreate, beforeUpdate, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetInformasiPenyewaan extends BaseModel {
    static get table() {
        return "aset_informasi_penyewaan"
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public nama_penyewa: string;

    @column()
    public no_kontak: string;

    @column()
    public perjanjian_awal: Date;

    @column()
    public perjanjian_akhir: Date;

    @column()
    public tipe: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetInformasiPenyewaan: AsetInformasiPenyewaan) {
        AsetInformasiPenyewaan.id = uuidv4();
        AsetInformasiPenyewaan.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetInformasiPenyewaan: AsetInformasiPenyewaan) {
        AsetInformasiPenyewaan.updated_at = new Date();
    }
}
