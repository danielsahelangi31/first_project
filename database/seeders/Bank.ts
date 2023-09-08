import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Bank from 'App/Models/Bank'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
      await Bank.createMany([
        {
          name: "PT Bank Central Asia Tbk"
        },
        {
          name: "PT Bank Mandiri (Persero) Tbk"
        },
        {
          name: "PT Bank Negara Indonesia (Persero) Tbk"
        },
        {
          name: "PT Bank Rakyat Indonesia (Persero) Tbk"
        },
        {
          name: "PT Bank Central Asia Tbk"
        },
        {
          name: "PT Bank CIMB Niaga Tbk"
        },
        {
          name: "PT Bank Maybank Indonesia, Tbk"
        },
        {
          name: "PT Bank Pembangunan Daerah Jawa Timur Tbk"
        },
        {
          name: "PT Bank Pembangunan Daerah Nusa Tenggara Timur"
        }
      ])
    }
}
