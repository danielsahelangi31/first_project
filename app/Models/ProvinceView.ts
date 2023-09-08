
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProvinceView extends BaseModel {

  public static table = "province_view";

  @column({ isPrimary: true })
  public id: number

  @column()
  public province: string

}
