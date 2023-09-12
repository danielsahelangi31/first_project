import Route from '@ioc:Adonis/Core/Route';

// master asset
Route.group(()=> {
    Route.get('/', 'MasterAssetsController.index');
    Route.post('/insert', 'MasterAssetsController.create');
    Route.put('/update', 'MasterAssetsController.update');
    Route.get('/view/:id', 'MasterAssetsController.view');
    Route.get('/updateStatus/:id', 'MasterAssetsController.updateStatus');
    Route.get('/create-excel', 'MasterAssetsController.createExcelData');
    Route.post('/api-master', 'ApiMasterDataController.MasterAset');
  }).prefix('master-aset');