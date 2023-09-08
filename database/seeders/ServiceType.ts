import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ServiceType from 'App/Models/ServiceType'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await ServiceType.createMany([
      {
        name: 'Jasa Kapal'
      },
      {
        name: 'Jasa PetiKemas'
      },
      {
        name: 'Jasa Non Petikemas'
      },
      {
        name: 'Jasa Penumpang'
      },
      {
        name: 'Jasa Rupa-Rupa'
      },
      {
        name: 'Jasa Lainnya'
      },
      {
        name: 'Tanah, Bangunan, Air dan Listrik'
      }
      
    ])
  }
}
