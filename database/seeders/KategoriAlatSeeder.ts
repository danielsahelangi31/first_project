import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import KategoriAlat from 'App/Models/KategoriAlat'

export default class extends BaseSeeder {
  public async run () {
    KategoriAlat.createMany([
      {
        kategori: 'Alat Utama'
      },
      {
        kategori: 'Alat Bantu'
      },
      {
        kategori: 'Alat Pendukung'
      }
    ]);
  }
}
