import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class StrukturTerminalView extends BaseModel {
  public static table = "struktur_terminal";
  @column()
  public terminal_id: string;
  @column()
  public branch_id: string;
  @column()
  public regional_id: string;
  @column()
  public ho_id: string;
}
