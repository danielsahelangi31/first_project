import Route from "@ioc:Adonis/Core/Route";

// Master Dermaga
Route.group(() => {
    Route.get("/main/:id?", "MasterDermagasController.index");
    Route.get("/add", "MasterDermagasController.add");
    Route.get("/store", "MasterDermagasController.store");
    Route.get("/edit/:id?", "MasterDermagasController.edit");
    Route.get("/update", "MasterDermagasController.update");
    Route.get("/view/:id?", "MasterDermagasController.view");
    Route.get("/delete/:id", "MasterDermagasController.delete");
    Route.get("/nonaktif/:id", "MasterDermagasController.nonaktif");
    Route.get("/aktif/:id", "MasterDermagasController.aktif");
    Route.get("/kirim/:id", "MasterDermagasController.kirim");
    Route.get("/approve", "MasterDermagasController.approve");
    Route.get("/reject", "MasterDermagasController.reject");
    Route.get("/excel", "MasterDermagasController.writeExcel");
    Route.get("/data-dermaga", "MasterDermagasController.exportData");
    Route.get("/modal-data", "MasterDermagasController.modalData");
    Route.get("/count-norequest", "MasterDermagasController.countNoRequest");
    Route.get("/approval-order", "MasterDermagasController.approvalOrder");
    Route.post("/uploadFile", "MasterDermagasController.uploadFile");
}).prefix("/master-dermaga").middleware(["auth", "logR"]);