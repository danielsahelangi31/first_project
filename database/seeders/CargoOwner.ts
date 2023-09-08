import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CargoOwner from 'App/Models/CargoOwner'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await CargoOwner.createMany([
      {
        name: "Cargo Owner PetiKemas"
      },
      {
        name: "Cargo Owner non PetiKemas"
      }
    ])
  }
}
