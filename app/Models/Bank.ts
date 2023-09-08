import { v4 as uuidv4 } from "uuid";
import { BaseModel, column,beforeCreate,beforeUpdate, } from '@ioc:Adonis/Lucid/Orm'

export default class Bank extends BaseModel {
  public static table = "banks";

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string;

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(Bank: Bank) {
    Bank.created_at = new Date();
    Bank.updated_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(Bank: Bank) {
    Bank.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(Bank: Bank) {
    Bank.id = uuidv4();
  }
}
