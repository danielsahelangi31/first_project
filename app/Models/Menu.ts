import { DateTime } from "luxon";
import { BaseModel, beforeCreate, column, HasMany, hasMany, scope } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import Permission from "App/Models/Permission";

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public parent_id: string;

  @column()
  public name: string;

  @column()
  public alias: string;

  @column()
  public url: string;

  @column()
  public icon: string;

  @column()
  public flag: bigint;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeCreate()
  public static async setId(Menu: Menu) {
    Menu.id = uuidv4();
  }

  @hasMany(() => Menu, { foreignKey: "parent_id" })
  public childMenu: HasMany<typeof Menu>;

  public static parent = scope((query) => {
    query.whereNull("parent_id");
  });

  @hasMany(() => Permission, { foreignKey: "menu_id" })
  public permissions: HasMany<typeof Permission>;

  public static active = scope((query) => {
    query.where("flag", "1");
  });
}
