import Route from '@ioc:Adonis/Core/Route';

//master barang
Route.group(() => {
    Route.get('/', 'MasterBarangController.index');
    Route.get('/add', 'MasterBarangController.add');
  }).prefix('master-barang')