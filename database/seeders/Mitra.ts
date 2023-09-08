import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Mitra from 'App/Models/Mitra'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Mitra.createMany([
      {
        name: "PBM"
      },
      {
        name: "Kerjasama Usaha (kerjasama alat, lahan, dan aset lainnya)"
      },
      {
        name: "Terminal Operator"
      }
    ])
  }
}
