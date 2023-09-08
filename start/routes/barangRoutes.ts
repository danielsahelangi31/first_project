import Route from '@ioc:Adonis/Core/Route';

//master barang
Route.group(() => {
    Route.get('/', 'MasterBarangController.index');
  }).prefix('master-barang')