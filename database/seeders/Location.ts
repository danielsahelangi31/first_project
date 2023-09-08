import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Location from 'App/Models/Location'

export default class LocationSeeder extends BaseSeeder {
  public async run () {
    await Location.createMany([
      {
        name : 'Anak Perusahaan',
      },
      {
        name : 'Cabang',
      },
      {
        name : 'Office',
      }
    ])
  }
}
