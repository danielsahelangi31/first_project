import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PowerSource from 'App/Models/PowerSource'

export default class extends BaseSeeder {
  public async run () {
    PowerSource.createMany([
      {
        name: 'Listrik'
      },
      {
        name: 'Engine Diesel'
      },
      {
        name: 'Baterai Hybrid'
      },
      {
        name: 'Manual'
      },
      {
        name: 'Hydraulics'
      }
    ]);
  }
}
