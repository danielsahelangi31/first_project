import { column, BaseModel, hasMany, HasMany, beforeCreate, beforeSave, beforeUpdate } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Entity from "./Entity";
import { v4 as uuidv4 } from "uuid";

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public level: number;


  @hasMany(() => Entity, {
    foreignKey: "id_location"
  })
  public entities: HasMany<typeof Entity>;

  // @column.dateTime({ autoCreate: false })
  // public created_at: DateTime;
  // @column.dateTime({ autoCreate: false, autoUpdate: false })
  // public updated_at: DateTime;


  @beforeCreate()
  public static async uuid(Location: Location) {
    Location.id = uuidv4();
  }

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(Location: Location) {
    Location.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(Location: Location) {
    Location.updated_at = new Date();
  }
}
