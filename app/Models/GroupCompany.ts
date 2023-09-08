// import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import Entity from './Entity';

export default class GroupCompany extends BaseModel {
  public static $table = "group_companies"
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public sort_no: string;
  
  @column()
  public level: string;

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  // public updatedAt: DateTime


  @hasMany(() => Entity, {foreignKey: "id_location"})
  public entity: HasMany<typeof Entity>

  @beforeCreate()
  public static async uuid(GroupCompany: GroupCompany) {
    GroupCompany.id = uuidv4()
  }
}
