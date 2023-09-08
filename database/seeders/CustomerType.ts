import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CustomerType from 'App/Models/CustomerType'


export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await CustomerType.createMany([
      {
        name_type: 'Pelanggan'
      },
      {
        name_type: 'Mitra'
      },
      {
        name_type: 'Pelanggan dan Mitra'
      }
    ])
  }
}
