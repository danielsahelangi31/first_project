import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { v4 as uuidv4 } from "uuid";
import GroupCompany from './GroupCompany';
import MasterCompany from './MasterCompany';
import JobTitle from './JobTitle';

export default class Entity extends BaseModel {
  public static table = "entities"
  @column({ isPrimary: true })
  public id: string;

  @column()
  public id_location: number;

  @column()
  public id_entity: string;

  @column()
  public id_job_title: string;

  @column()
  public title_alias: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(Entity: Entity) {
    Entity.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(Entity: Entity) {
    Entity.updated_at = new Date();
  }

  @belongsTo(() => GroupCompany, {foreignKey: "id_location"})
  public groupCompany: BelongsTo<typeof GroupCompany>
  
  @belongsTo(() => JobTitle, {foreignKey: 'id_job_title'})
  public jobTitle: BelongsTo<typeof JobTitle>

  @belongsTo(() => MasterCompany, {foreignKey: "id_entity"})
  public masterCompany: BelongsTo<typeof MasterCompany>

  @beforeCreate()
  public static async uuid(Entity: Entity) {
    Entity.id = uuidv4();
  }
}
