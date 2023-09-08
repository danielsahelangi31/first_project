import Route from '@ioc:Adonis/Core/Route';

//master kapal
Route.group(() => {
    Route.get('', 'MasterVesselsController.index');
    Route.get('/add', 'MasterVesselsController.add');
    Route.get('/edit/:id', 'MasterVesselsController.edit');
    Route.get('/view/:id', 'MasterVesselsController.view');
    Route.get('/store', 'MasterVesselsController.store');
    Route.post('/updateData/:id', 'MasterVesselsController.updateData');
    Route.get('/data-modal', 'MasterVesselsController.modalData');
    Route.post('/approve', 'MasterVesselsController.approval');
    Route.get('/reject', 'MasterVesselsController.reject');
    Route.get('/renewal/:id', 'MasterVesselsController.viewRenewal');
    Route.post('/store-renewal', 'MasterVesselsController.storeRenewal');
    Route.get('/updateStatus/:id', 'MasterVesselsController.updateStatus');
    Route.get('/create-excel', 'MasterVesselsController.createExcelData');
    Route.get('/view-approve/:id', 'MasterVesselsController.viewApproved');
}).prefix('/master-kapal').middleware('auth')
Route.get('/master-kapal/destroy/:id', 'MasterVesselsController.destroy');