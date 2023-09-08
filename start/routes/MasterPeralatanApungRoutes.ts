import Route from "@ioc:Adonis/Core/Route";

// Master Peralatan Apung
Route.group(() => {
    Route.get("/alat-apung/:id?", "MasterApungsController.index");
    Route.get("/add-alat-apung", "MasterApungsController.add");
    Route.get("/store-alat-apung", "MasterApungsController.store");
    Route.get("/edit-alat-apung/:id", "MasterApungsController.edit");
    Route.get("/update-alat-apung", "MasterApungsController.update");
    Route.get("/view-alat-apung/:id", "MasterApungsController.view");
    Route.get("/delete-alat-apung/:id", "MasterApungsController.delete");
    Route.get("/nonaktif-alat-apung/:id", "MasterApungsController.nonaktif");
    Route.get("/aktif-alat-apung/:id", "MasterApungsController.aktif");
    Route.get("/kirim-alat-apung/:id", "MasterApungsController.kirim");
    Route.get("/approve-alat-apung", "MasterApungsController.approve");
    Route.get("/reject-alat-apung", "MasterApungsController.reject");
    Route.get("/excel-alat-apung", "MasterApungsController.writeExcel");
    Route.get("/data-alat-apung", "MasterApungsController.exportData");
    Route.get("/alatap-modal-data", "MasterApungsController.modalData");
    Route.get("/count-norequest-alatap", "MasterApungsController.countNoRequest");
    Route.get("/approval-order-alatap", "MasterApungsController.approvalOrder");
    Route.post("/upload-file/ap", "MasterApungsController.uploadFile");
    Route.get("/download-uploaded-file/ap/:filename", "MasterApungsController.downloadUploadedFile");
}).prefix('/master-peralatan').middleware(["auth", "logR"]);