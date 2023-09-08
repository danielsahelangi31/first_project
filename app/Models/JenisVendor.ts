import { BaseModel, column,} from '@ioc:Adonis/Lucid/Orm'
// import { v4 as uuidv4 } from "uuid"

export default class JenisVendor extends BaseModel {
  public static table = "jenis_vendor";

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;
}
