import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class StrukturBranchView extends BaseModel {
  public static table = 'struktur_branch'
  @column()
  public branch_id: string
  @column()
  public regional_id: string
  @column()
  public ho_id: string
}
