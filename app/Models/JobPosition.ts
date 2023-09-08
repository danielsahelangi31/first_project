import { v4 as uuidv4 } from "uuid";
import { BaseModel, beforeCreate, beforeUpdate, column } from "@ioc:Adonis/Lucid/Orm";

export default class JobPosition extends BaseModel {
  public static table = "job_titles";
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public departement: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(JobPosition: JobPosition) {
    JobPosition.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(JobPosition: JobPosition) {
    JobPosition.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(JobPosition: JobPosition) {
    JobPosition.id = uuidv4()
  }
}
