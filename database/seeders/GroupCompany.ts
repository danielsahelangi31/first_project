import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import GroupCompany from 'App/Models/GroupCompany'

export default class extends BaseSeeder {
  public async run () {
    await GroupCompany.createMany([
      {
        name: "Regional 1"
      },
      {
        name: "Regional 2"
      },
      {
        name: "Regional 3"
      },
      {
        name: "Regional 4"
      },
    ])
  }
}
