import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BentukUsaha from 'App/Models/BentukUsaha'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await BentukUsaha.createMany([
      {
        name: "PT"
      },
      {
        name: "CV"
      },
      {
        name: "FIRMA"
      },
      {
        name: "UD"
      },
      {
        name: "BUT"
      },
      {
        name: "UMKM"
      },
      {
        name: "Perorangan"
      },
      {
        name: "Koperasi"
      }
    ])
  }
}
