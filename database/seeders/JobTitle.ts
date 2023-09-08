import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import JobTitle from 'App/Models/JobTitle'

export default class extends BaseSeeder {
  public async run () {
    await JobTitle.createMany([
      {
        name: 'ADMINISTRATOR'
      },
      {
        name: 'DEPT SPV'
      },
      {
        name: 'OFFICER'
      }
    ])
    // Write your database queries inside the run method
  }
}
