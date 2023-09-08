import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ParentCompany from 'App/Models/ParentCompany'

export default class extends BaseSeeder {
  public async run () {
    await ParentCompany.createMany([
      {
        name: "Pelindo HO",
        code_parent: 110000
      },
      {
        name: "Cabang",
        code_parent: 150002
      },
      {
        name: "Regional",
        code_parent: 130000
      },
    ])
    // Write your database queries inside the run method
  }
}
