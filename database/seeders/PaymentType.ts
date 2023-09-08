import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PaymentType from 'App/Models/PaymentType'


export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await PaymentType.createMany([
      {
        name: 'Transfer'
      },
      {
        name: 'AutoCollection'
      },
      {
        name: 'Advance Payment'
      },
      {
        name: 'CMS'
      },
      {
        name: 'Bill Payment'
      },
      {
        name: 'Uang Jaminan Pelayanan/Uang Pertanggungan (uper)'
      },
      {
        name: 'Lainnya'
      }
    ])
  }
}
