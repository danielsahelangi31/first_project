import { DateTime } from 'luxon'
import { BaseModel,belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Location from './Location'

export default class BillingAccountCustomer extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public ERP_id: number

  @column()
  public bank_acc: number

  @column()
  public bank_name: string

  @column()
  public id_npwp_number: number

  @column()
  public id_payment_type: number
  
  @column()
  public id_location: number

  // @column.dateTime({ autoCreate: true })
  // public createdAt: DateTime

  // @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Location, {
    localKey: 'id_location'
  })
  public location: BelongsTo<typeof Location>
}
