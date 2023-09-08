import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CustomerGroup from 'App/Models/CustomerGroup'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await CustomerGroup.createMany([
      {
        name: 'BUMN'
      },
      {
        name: 'Swasta'
      },
      {
        name: 'TNI/Polri'
      },
      {
        name: 'Instansi Pemerintah'
      },
      {
        name: 'Grup BUMN (afiliasi/anprus BUMN)'
      },
      {
        name: 'Kelompok Afiliasi (untuk afiliasi/anprus)'
      },
      {
        name: 'UMKM'
      },
      {
        name: 'Perorangan'
      },
      {
        name: 'Koperasi'
      },
      {
        name: 'Yayasan'
      },
      {
        name: 'Tidak ada dalam kategori'
      },
    ])
  }
}
