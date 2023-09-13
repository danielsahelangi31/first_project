import Route from '@ioc:Adonis/Core/Route';

// master vendor
Route.group(()=> {
    Route.get('/', 'MasterVendorsController.index');
    Route.get('/add', 'MasterVendorsController.add');
    Route.get('/edit/:id', 'MasterVendorsController.edit');
    Route.get('/renewal/:id', 'MasterVendorsController.renewal');
    Route.get('/view/:id', 'MasterVendorsController.view');
    Route.get('/view-approved/:id', 'MasterVendorsController.viewApproved');
    Route.post('/store', 'MasterVendorsController.store');
    Route.put('/update/:id', 'MasterVendorsController.update')
    Route.put('/update-status/:id', 'MasterVendorsController.updateStatus')
    Route.post('/renewal-add/:id', 'MasterVendorsController.storeRenewal');
    Route.delete("/delete/:id", "MasterVendorsController.destroy");
    Route.post("/approval", "MasterVendorsController.approval");
    Route.post("/reject", "MasterVendorsController.reject");
    Route.get("/modal-data", "MasterVendorsController.modalData");
    Route.post("/upload", "MasterVendorsController.upload");
    Route.delete("/delete-file", "MasterVendorsController.deleteUpload");
  }).prefix('/master-vendor').middleware("auth")