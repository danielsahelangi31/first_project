import { BaseModel,beforeCreate,beforeUpdate,belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from "uuid";
import RequestBasicInfoCustomer from './RequestBasicInfoCustomer';


export default class RequestNpwp extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public npwp:string

  @column()
  public npwp_name:string

  @column()
  public npwp_address:string

  @column()
  public type:string

  @column()
  public id_basic_info:string

  @column()
  public created_at: Date;

  @column()
  public updated_at: Date;

  @beforeCreate()
  public static async genCreatedAt(RequestNpwp: RequestNpwp) {
    RequestNpwp.created_at = new Date();
  }

  @beforeUpdate()
  public static async genUpdatedAt(RequestNpwp: RequestNpwp) {
    RequestNpwp.updated_at = new Date();
  }

  @beforeCreate()
  public static async uuid(Npwp: RequestNpwp) {
    Npwp.id = uuidv4();
  }

  @belongsTo(() => RequestBasicInfoCustomer, { foreignKey: "id_basic_info"} )
  public requestBasicInfoCustomer: BelongsTo<typeof RequestBasicInfoCustomer>
}
