import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
export default class AsetStatusPengelolaan extends BaseModel {
    static get table() {
        return "aset_status_pengelolaan";
    }

    @column({ isPrimary: true })
    public id: string;

    @column()
    public header_id: string;

    @column()
    public rincian: string;

    @column()
    public pihak_menempati: string;

    @column()
    public created_at: Date;

    @column()
    public updated_at: Date;

    @beforeCreate()
    public static async genCreatedAt(AsetStatusPengelolaan: AsetStatusPengelolaan) {
        AsetStatusPengelolaan.id = uuidv4();
        AsetStatusPengelolaan.created_at = new Date();
    }

    @beforeUpdate() 
    public static async genUpdateAt(AsetStatusPengelolaan: AsetStatusPengelolaan) {
        AsetStatusPengelolaan.updated_at = new Date();
    }
}
