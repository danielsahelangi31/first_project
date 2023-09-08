import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ShippingLine from 'App/Models/ShippingLine'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await ShippingLine.createMany([
      {
        name: 'Shippingline petikemas domestik'
      },
      {
        name: 'Shippingline petikemas internasional'
      },
      {
        name: 'Shippingline non petikemas domestik'
      },
      {
        name: 'Shippingline non petikemas internasional'
      },
    ])
  }
}
