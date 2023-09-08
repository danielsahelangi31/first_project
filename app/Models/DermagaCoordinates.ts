import { v4 as uuidv4 } from 'uuid';
import { BaseModel, beforeCreate, beforeUpdate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Dermagas from './Dermaga';
import DermagaApproved from './DermagaApproved';

export default class DermagaCoordinates extends BaseModel {
  public static table = "dermaga_coordinates"

  @column({ isPrimary: true })
  public id: string

  @column()
  public id_dermaga: string

  @column()
  public longitude: string

  @column()
  public latitude: string

  @column()
  public line_number: string

  @column()
  public id_dermaga_approved: string

  @column()
  public created_at: Date

  @column()
  public updated_at: Date

  @beforeCreate()
  public static async setId(data: DermagaCoordinates) {
    data.id = uuidv4();
    data.created_at = new Date();
  }

  @beforeUpdate()
  public static async updateDate(data: DermagaCoordinates) {
    data.updated_at = new Date();
  }

  @belongsTo(() => Dermagas, { foreignKey: "id_dermaga" })
  public dermagas: BelongsTo<typeof Dermagas>;

  @belongsTo(() => DermagaApproved, { foreignKey: "id_dermaga_approved" })
  public dermaga_approveds: BelongsTo<typeof DermagaApproved>;
}
